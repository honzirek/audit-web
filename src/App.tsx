import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuditTable } from './AuditTable';
import { AuditDetail } from './AuditDetail';
import { useState, useLayoutEffect, useRef } from 'react';

const queryClient = new QueryClient();

function App() {
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const scrollPosition = useRef(0);

  const handleSelect = (id: string) => {
    // Save current scroll position before switching
    scrollPosition.current = window.scrollY;
    setSelectedAuditId(id);
    // Detail view should start at top
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedAuditId(null);
  };

  useLayoutEffect(() => {
    if (!selectedAuditId) {
        // Restore scroll position when returning to table
        window.scrollTo(0, scrollPosition.current);
    }
  }, [selectedAuditId]);

  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <div style={{ padding: '20px' }}>
            <h1>Audit Logs</h1>
            <div style={{ display: selectedAuditId ? 'none' : 'block' }}>
                <AuditTable onSelect={handleSelect} selectedId={selectedAuditId} />
            </div>
            {selectedAuditId && (
                <AuditDetail auditId={selectedAuditId} onBack={handleBack} />
            )}
        </div>
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;
