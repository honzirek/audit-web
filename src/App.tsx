import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuditTable } from './AuditTable';

const queryClient = new QueryClient();

function App() {
  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <div style={{ padding: '20px' }}>
            <h1>Audit Logs</h1>
            <AuditTable />
        </div>
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;
