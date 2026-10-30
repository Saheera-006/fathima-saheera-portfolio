import { useEffect, useState, useCallback, useRef } from "react";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  getDoc,
  getDocs,
  type Unsubscribe,
} from "firebase/firestore";

import { db, auth, ADMIN_AUTH_UID } from "./firebase";
import { PORTFOLIO_DATA } from "../data/portfolioData";

export type PortfolioDataState = typeof PORTFOLIO_DATA;

export type SyncStatus =
  | "loading"
  | "synced"
  | "saving"
  | "error"
  | "offline";

const PORTFOLIO_COLLECTION = collection(db, "portfolio");
const LEGACY_PORTFOLIO_DOC = doc(db, "portfolio", "content");

// Each major section is stored as its own document for easier management.
const PORTFOLIO_SECTIONS = [
  "profile",
  "storyStages",
  "projects",
  "experience",
  "skills",
  "certifications",
] as const;
type PortfolioSection = (typeof PORTFOLIO_SECTIONS)[number];

// Keep Firestore writes in order so two fast edits cannot overwrite each other.
let portfolioWriteQueue: Promise<void> = Promise.resolve();

function getStoredPortfolioData(): PortfolioDataState {
  return structuredClone(PORTFOLIO_DATA);
}

function asObject(value: unknown): Record<string, any> {
  return value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
    ? (value as Record<string, any>)
    : {};
}

function mergePortfolioData(
  savedData: Partial<PortfolioDataState>
): PortfolioDataState {
  const defaults = getStoredPortfolioData();
  const saved = asObject(savedData);
  const defaultProfile = asObject(defaults.profile);
  const savedProfile = asObject(saved.profile);

  const mergedProfile = {
    ...defaultProfile,
    ...savedProfile,

    // Keep nested defaults when older Firestore data is incomplete.
    education: {
      ...asObject(defaultProfile.education),
      ...asObject(savedProfile.education),
    },

    socialLinks: {
      ...asObject(defaultProfile.socialLinks),
      ...asObject(savedProfile.socialLinks),
    },

    seo: {
      ...asObject(defaultProfile.seo),
      ...asObject(savedProfile.seo),
    },
  };

  const merged = {
    ...defaults,
    ...saved,
    profile: mergedProfile,

    storyStages: Array.isArray(saved.storyStages)
      ? saved.storyStages
      : defaults.storyStages,

    projects: Array.isArray(saved.projects)
      ? saved.projects
      : defaults.projects,

    experience: Array.isArray(saved.experience)
      ? saved.experience
      : defaults.experience,

    skills: Array.isArray(saved.skills)
      ? saved.skills
      : defaults.skills,

    certifications: Array.isArray(saved.certifications)
      ? saved.certifications
      : defaults.certifications,
  };

  return merged as PortfolioDataState;
}

function sanitizeForFirestore(value: any): any {
  if (Array.isArray(value)) {
    // Firestore does not accept undefined array entries.
    return value.map((item) =>
      item === undefined ? null : sanitizeForFirestore(item)
    );
  }

  if (value && typeof value === "object") {
    if (value instanceof Date) return value;

    // Firestore rejects undefined fields. Omit them instead of failing
    // the entire portfolio save because an optional field is absent.
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, sanitizeForFirestore(item)])
    );
  }

  return value;
}

function isAdmin(): boolean {
  return Boolean(
    auth.currentUser &&
      auth.currentUser.uid === ADMIN_AUTH_UID
  );
}

function sectionPayload(
  data: PortfolioDataState,
  section: PortfolioSection
): unknown {
  return sanitizeForFirestore(data[section]);
}

function hasSplitSectionDocuments(ids: Set<string>): boolean {
  return PORTFOLIO_SECTIONS.some((section) => ids.has(section));
}

async function writePortfolioData(
  data: PortfolioDataState,
  previousData?: PortfolioDataState
): Promise<void> {
  // Wait for Firebase Auth to finish restoring the current session before checking admin.
  await auth.authStateReady();

  if (!isAdmin()) {
    throw new Error(
      "Firebase admin session is missing or has the wrong UID. Please log out and sign in again."
    );
  }

  const currentWrite = portfolioWriteQueue.then(async () => {
    const changedSections = PORTFOLIO_SECTIONS.filter((section) => {
      if (!previousData) return true;
      return JSON.stringify(sectionPayload(data, section)) !==
        JSON.stringify(sectionPayload(previousData, section));
    });

    // Save only changed sections. A project edit no longer rewrites profile,
    // skills, certificates, and every other section.
    await Promise.all(
      changedSections.map((section) => {
        const payload = sectionPayload(data, section);
        const documentData = section === "profile"
          ? { ...(payload as Record<string, unknown>), updatedAt: new Date() }
          : { items: payload, updatedAt: new Date() };
        return setDoc(doc(PORTFOLIO_COLLECTION, section), documentData);
      })
    );
  });

  // A failed write must not permanently block later saves.
  portfolioWriteQueue = currentWrite.catch(() => undefined);
  await currentWrite;
}

export async function seedInitialFirestoreData(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await auth.authStateReady();
    if (!isAdmin()) {
      throw new Error("Please log in with the admin account.");
    }

    const snapshot = await getDocs(PORTFOLIO_COLLECTION);
    const ids = new Set(snapshot.docs.map((item) => item.id));

    // One-time migration: if the old `portfolio/content` document exists,
    // preserve its content while splitting it into the new section documents.
    const legacySnapshot = await getDoc(LEGACY_PORTFOLIO_DOC);
    const initialData = legacySnapshot.exists()
      ? mergePortfolioData(legacySnapshot.data() as Partial<PortfolioDataState>)
      : getStoredPortfolioData();

    if (!hasSplitSectionDocuments(ids)) {
      await writePortfolioData(initialData);
      return { success: true };
    }

    // If an earlier migration was interrupted, create only the missing docs;
    // never overwrite a section that already contains saved data.
    const missingSections = PORTFOLIO_SECTIONS.filter((section) => !ids.has(section));
    await Promise.all(
      missingSections.map((section) => {
        const payload = sectionPayload(initialData, section);
        const documentData = section === "profile"
          ? { ...(payload as Record<string, unknown>), updatedAt: new Date() }
          : { items: payload, updatedAt: new Date() };
        return setDoc(doc(PORTFOLIO_COLLECTION, section), documentData);
      })
    );
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to seed Firestore data.",
    };
  }
}

export function usePortfolioData() {
  const [data, setData] =
    useState<PortfolioDataState>(getStoredPortfolioData);

  const [loading, setLoading] = useState(true);

  const [syncStatus, setSyncStatus] =
    useState<SyncStatus>("loading");

  const [syncError, setSyncError] = useState<string | null>(null);

  const hasLocalChanges = useRef(false);
  const saveCount = useRef(0);

  const dataRef = useRef<PortfolioDataState>(
    getStoredPortfolioData()
  );

  useEffect(() => {
    let active = true;
    let unsubscribe: Unsubscribe | undefined;

    unsubscribe = onSnapshot(
      PORTFOLIO_COLLECTION,
      (snapshot) => {
        if (!active) return;

        if (hasLocalChanges.current || saveCount.current > 0) {
          setLoading(false);
          return;
        }

        const documents = new Map(snapshot.docs.map((item) => [item.id, item.data()]));
        const hasSplitDocs = hasSplitSectionDocuments(new Set(documents.keys()));
        let nextData: PortfolioDataState;

        if (hasSplitDocs) {
          const sectionData: Record<string, unknown> = {};
          for (const section of PORTFOLIO_SECTIONS) {
            const document = documents.get(section);
            if (!document) continue;

            if (section === "profile") {
              const { updatedAt: _updatedAt, ...profileFields } = document;
              sectionData.profile = profileFields;
            } else if (Array.isArray(document.items)) {
              sectionData[section] = document.items;
            }
          }
          nextData = mergePortfolioData(sectionData as Partial<PortfolioDataState>);
        } else {
          // Backward compatibility while old data is waiting to be migrated.
          const legacy = documents.get("content");
          nextData = legacy
            ? mergePortfolioData(legacy as Partial<PortfolioDataState>)
            : getStoredPortfolioData();
        }

        dataRef.current = nextData;
        setData(nextData);
        setLoading(false);
        setSyncStatus("synced");
        setSyncError(null);
      },
      (error) => {
        if (!active) return;

        console.error("Portfolio Firestore error:", error);
        setLoading(false);
        setSyncStatus("error");
        setSyncError(error.message);
      }
    );

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const updateAllData = useCallback(
    async (updatedData: PortfolioDataState) => {
      await auth.authStateReady();
      if (!isAdmin()) {
        throw new Error(
          "Firebase admin session is missing or has the wrong UID. Please log out and sign in again."
        );
      }

      const safeData = mergePortfolioData(updatedData);
      const previousData = dataRef.current;

      // Update the ref immediately so rapid consecutive edits are based on the
      // latest version, not an older Firestore snapshot.
      dataRef.current = safeData;

      saveCount.current += 1;
      hasLocalChanges.current = true;

      setSyncStatus("saving");
      setSyncError(null);

      try {
        await writePortfolioData(safeData, previousData);

        dataRef.current = safeData;
        setData(safeData);
        setSyncStatus("synced");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Save failed.";

        setSyncStatus("error");
        setSyncError(message);

        // Restore the previous data only if no newer edit has replaced it.
        if (dataRef.current === safeData) {
          dataRef.current = previousData;
        }

        console.error("Failed to save portfolio data:", error);
        throw error;
      } finally {
        saveCount.current = Math.max(0, saveCount.current - 1);

        if (saveCount.current === 0) {
          hasLocalChanges.current = false;
        }
      }
    },
    []
  );

  const savePortfolioData = updateAllData;

  const updateProfile = useCallback(
    async (updates: Partial<PortfolioDataState["profile"]>) => {
      const currentData = dataRef.current;
      const currentProfile = currentData.profile;

      await updateAllData({
        ...currentData,
        profile: {
          ...currentProfile,
          ...updates,

          education: {
            ...asObject(currentProfile.education),
            ...asObject(updates.education),
          },

          socialLinks: {
            ...asObject(currentProfile.socialLinks),
            ...asObject(updates.socialLinks),
          },

          seo: {
            ...asObject(currentProfile.seo),
            ...asObject(updates.seo),
          },
        },
      });
    },
    [updateAllData]
  );

  const addProject = useCallback(
    async (project: PortfolioDataState["projects"][number]) => {
      const current = dataRef.current;
      await updateAllData({
        ...current,
        projects: [...current.projects, project],
      });
    },
    [updateAllData]
  );

  const updateProject = useCallback(
    async (
      projectOrId: PortfolioDataState["projects"][number] | string,
      updates?: Partial<PortfolioDataState["projects"][number]>
    ) => {
      const current = dataRef.current;
      const id =
        typeof projectOrId === "string"
          ? projectOrId
          : projectOrId.id;
      const changes =
        typeof projectOrId === "string"
          ? updates ?? {}
          : projectOrId;

      await updateAllData({
        ...current,
        projects: current.projects.map((item) =>
          item.id === id ? { ...item, ...changes } : item
        ),
      });
    },
    [updateAllData]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      const current = dataRef.current;
      await updateAllData({
        ...current,
        projects: current.projects.filter((item) => item.id !== id),
      });
    },
    [updateAllData]
  );

  const addCertification = useCallback(
    async (
      certification: PortfolioDataState["certifications"][number]
    ) => {
      const current = dataRef.current;
      await updateAllData({
        ...current,
        certifications: [...current.certifications, certification],
      });
    },
    [updateAllData]
  );

  const updateCertification = useCallback(
    async (
      certificationOrId:
        | PortfolioDataState["certifications"][number]
        | string,
      updates?: Partial<PortfolioDataState["certifications"][number]>
    ) => {
      const current = dataRef.current;
      const id =
        typeof certificationOrId === "string"
          ? certificationOrId
          : certificationOrId.id;
      const changes =
        typeof certificationOrId === "string"
          ? updates ?? {}
          : certificationOrId;

      await updateAllData({
        ...current,
        certifications: current.certifications.map((item) =>
          item.id === id ? { ...item, ...changes } : item
        ),
      });
    },
    [updateAllData]
  );

  const deleteCertification = useCallback(
    async (id: string) => {
      const current = dataRef.current;
      await updateAllData({
        ...current,
        certifications: current.certifications.filter(
          (item) => item.id !== id
        ),
      });
    },
    [updateAllData]
  );

  const addSkill = useCallback(
    async (skill: PortfolioDataState["skills"][number]) => {
      const current = dataRef.current;
      await updateAllData({
        ...current,
        skills: [...current.skills, skill],
      });
    },
    [updateAllData]
  );

  const updateSkill = useCallback(
    async (
      skillOrId: PortfolioDataState["skills"][number] | string,
      updates?: Partial<PortfolioDataState["skills"][number]>
    ) => {
      const current = dataRef.current;
      const id =
        typeof skillOrId === "string" ? skillOrId : skillOrId.id;
      const changes =
        typeof skillOrId === "string" ? updates ?? {} : skillOrId;

      await updateAllData({
        ...current,
        skills: current.skills.map((item) =>
          item.id === id ? { ...item, ...changes } : item
        ),
      });
    },
    [updateAllData]
  );

  const deleteSkill = useCallback(
    async (id: string) => {
      const current = dataRef.current;
      await updateAllData({
        ...current,
        skills: current.skills.filter((item) => item.id !== id),
      });
    },
    [updateAllData]
  );

  const addExperience = useCallback(
    async (experience: PortfolioDataState["experience"][number]) => {
      const current = dataRef.current;
      await updateAllData({
        ...current,
        experience: [...current.experience, experience],
      });
    },
    [updateAllData]
  );

  const updateExperienceItem = useCallback(
    async (
      experienceOrId: PortfolioDataState["experience"][number] | string,
      updates?: Partial<PortfolioDataState["experience"][number]>
    ) => {
      const current = dataRef.current;
      const id =
        typeof experienceOrId === "string"
          ? experienceOrId
          : experienceOrId.id;
      const changes =
        typeof experienceOrId === "string"
          ? updates ?? {}
          : experienceOrId;

      await updateAllData({
        ...current,
        experience: current.experience.map((item) =>
          item.id === id ? { ...item, ...changes } : item
        ),
      });
    },
    [updateAllData]
  );

  const updateExperience = updateExperienceItem;

  const deleteExperience = useCallback(
    async (id: string) => {
      const current = dataRef.current;
      await updateAllData({
        ...current,
        experience: current.experience.filter((item) => item.id !== id),
      });
    },
    [updateAllData]
  );

  const updateStoryStages = useCallback(
    async (storyStages: PortfolioDataState["storyStages"]) => {
      const current = dataRef.current;
      await updateAllData({
        ...current,
        storyStages,
      });
    },
    [updateAllData]
  );

  return {
    data,
    portfolioData: data,
    loading,
    syncStatus,
    syncError,
    savePortfolioData,
    updateAllData,
    updateProfile,
    addProject,
    updateProject,
    deleteProject,
    addCertification,
    updateCertification,
    deleteCertification,
    addSkill,
    updateSkill,
    deleteSkill,
    addExperience,
    updateExperience,
    updateExperienceItem,
    deleteExperience,
    updateStoryStages,
  };
}
