import { Todo, Todos } from '@/components/Todos';
import { client } from '@/lib/client';
import { gql } from 'graphql-request';

type MyListPageMetadata = {
  params: { listId: string };
};

export async function generateMetadata({ params }: MyListPageMetadata) {
  return {
    title: `TODO List ${params.listId}`,
  };
}

type MyListPageProps = MyListPageMetadata;

const GET_TODO_LIST = gql`
  query getTodos($getTodOsListId2: Int!) {
    getTODOs(listId: $getTodOsListId2) {
      id
      finished
      desc
    }
  }
`;

export default async function MyListPage({
  params: { listId },
}: MyListPageProps) {
  const { getTODOs } = await client.request<{ getTODOs: Todo[] }>(
    GET_TODO_LIST,
    {
      getTodOsListId2: parseInt(listId),
    },
  );

  return (
    <div className="flex align-center justify-center p-16 sm:p-8">
      <Todos listId={parseInt(listId)} list={getTODOs} />
    </div>
  );
}
