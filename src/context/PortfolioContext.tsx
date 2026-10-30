import { createContext, useContext, ReactNode } from 'react';
import { usePortfolioData, PortfolioDataState, SyncStatus } from '../lib/portfolioService';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface PortfolioContextType {
  data: PortfolioDataState;
  loading: boolean;
  syncStatus: SyncStatus;
  updateAllData: (data: PortfolioDataState) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType>({
  data: PORTFOLIO_DATA,
  loading: false,
  syncStatus: 'offline',
  updateAllData: async () => {},
});

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const portfolioState = usePortfolioData();

  return (
    <PortfolioContext.Provider
      value={{
        data: portfolioState.data,
        loading: portfolioState.loading,
        syncStatus: portfolioState.syncStatus,
        updateAllData: portfolioState.updateAllData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
