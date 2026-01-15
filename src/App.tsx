import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuditTable } from './AuditTable';
import { AuditDetail } from './AuditDetail';
import { useState, useLayoutEffect, useRef } from 'react';

const queryClient = new QueryClient();

import { useSearchParams, useNavigate } from 'react-router-dom';

function App() {
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const scrollPosition = useRef(0);
  
  const auditIdParam = searchParams.get('auditId');
  const view = auditIdParam ? 'detail' : 'list';

  const handleViewDetail = (id: string) => {
    // Save current scroll position before switching
    scrollPosition.current = window.scrollY;
    setSelectedAuditId(id); // Ensure it's highlighted too
    setSearchParams({ auditId: id }); // Navigate
    // Detail view should start at top
    window.scrollTo(0, 0);
  };

  const handleRowSelected = (id: string) => {
    setSelectedAuditId(id);
  };

  const handleBack = () => {
    navigate(-1); // Go back in history
  };

  useLayoutEffect(() => {
    if (view === 'list') {
        // Restore scroll position when returning to table
        window.scrollTo(0, scrollPosition.current);
    }
  }, [view]);

  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <div style={{ padding: '20px' }}>
            <h1>Audit Logs</h1>
            <div style={{ display: view === 'list' ? 'block' : 'none' }}>
                <AuditTable 
                    onViewDetail={handleViewDetail} 
                    onRowSelected={handleRowSelected}
                    selectedId={selectedAuditId} 
                />
            </div>
            {view === 'detail' && auditIdParam && (
                <AuditDetail auditId={auditIdParam} onBack={handleBack} />
            )}
        </div>
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;
