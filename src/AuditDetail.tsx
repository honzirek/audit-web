import { Button, Card, Group, Stack, Table, Text, Title, Badge, Code } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { getAuditLog } from './api';
import { format } from 'date-fns';

interface AuditDetailProps {
  auditId: string;
  onBack: () => void;
}

export const AuditDetail = ({ auditId, onBack }: AuditDetailProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['audit-log', auditId],
    queryFn: () => getAuditLog(auditId),
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError || !data) {
    return <Text c="red">Error loading audit details</Text>;
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Audit Detail: {data.id}</Title>
        <Button onClick={onBack} variant="outline">Back to List</Button>
      </Group>

      <Card withBorder padding="lg">
        <Stack gap="md">
            <Group>
                <Text fw={700}>Action:</Text> <Text>{data.action}</Text>
                <Text fw={700} ml="xl">Status:</Text> <Badge color={data.status === 'SUCCESS' ? 'green' : 'red'}>{data.status}</Badge>
            </Group>
            <Group>
                <Text fw={700}>Started At:</Text> <Text>{format(new Date(data.startedAt), 'PPpp')}</Text>
                <Text fw={700} ml="xl">Finished At:</Text> <Text>{data.finishedAt ? format(new Date(data.finishedAt), 'PPpp') : '-'}</Text>
            </Group>
            <Group>
                <Text fw={700}>Total Duration:</Text> <Text>{data.totalDurationMs} ms</Text>
                <Text fw={700} ml="xl">Total Attempts:</Text> <Text>{data.totalAttempts}</Text>
            </Group>
             <Group>
                <Text fw={700}>Summary:</Text> <Text>{data.summary}</Text>
            </Group>
            {data.metadata && (
                <Stack gap="xs">
                    <Text fw={700}>Metadata:</Text>
                    <Code block>{JSON.stringify(data.metadata, null, 2)}</Code>
                </Stack>
            )}
        </Stack>
      </Card>

      <Title order={3} mt="lg">Retry Attempts</Title>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Attempt No</Table.Th>
            <Table.Th>Phase</Table.Th>
            <Table.Th>Status Code</Table.Th>
            <Table.Th>Outcome</Table.Th>
            <Table.Th>Duration (ms)</Table.Th>
            <Table.Th>Started At</Table.Th>
            <Table.Th>Error Message</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.attempts.map((attempt, index) => (
            <Table.Tr key={index}>
              <Table.Td>{attempt.attemptNo}</Table.Td>
              <Table.Td>{attempt.phase}</Table.Td>
              <Table.Td>{attempt.statusCode}</Table.Td>
              <Table.Td>
                 <Badge color={attempt.outcome === 'SUCCESS' ? 'green' : 'red'}>{attempt.outcome}</Badge>
              </Table.Td>
              <Table.Td>{attempt.durationMs}</Table.Td>
              <Table.Td>{format(new Date(attempt.startedAt), 'PPpp')}</Table.Td>
              <Table.Td>{attempt.errorMessage || '-'}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
};
