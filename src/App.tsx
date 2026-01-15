import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuditTable } from './AuditTable';
import { AuditDetail } from './AuditDetail';
import { useState } from 'react';

const queryClient = new QueryClient();

function App() {
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedAuditId(id);
  };

  const handleBack = () => {
    setSelectedAuditId(null);
  };

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
