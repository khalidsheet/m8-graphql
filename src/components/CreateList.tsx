'use client';

import { client } from '@/lib/client';
import { gql } from 'graphql-request';
import { TodoList } from '@/components/MyLists';
import { MY_EMAIL_KEY } from '../constants/email';

const CREATE_TODO_LIST_MUTATION = gql`
  mutation CreateList($input: CreateTODOListInput!) {
    createTODOList(input: $input) {
      id
      created_at
      name
      email
    }
  }
`;

type CreateListProps = {
  onCreate(list: TodoList): void;
};

export const CreateList = ({ onCreate }: CreateListProps) => {
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onCreate({
      id: 0,
      name: formData.get('listName') as string,
      email: MY_EMAIL_KEY,
      created_at: new Date().toISOString(),
    });

    await client.request<{ createTODOList: TodoList }>(
      CREATE_TODO_LIST_MUTATION,
      {
        input: {
          name: formData.get('listName'),
          email: MY_EMAIL_KEY,
        },
      },
    );

    // clear form
    formData.set('listName', '');
  };

  return (
    <div className="w-full text-center">
      <h2 className="text-3xl mb-8">Create new List</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          id="listName"
          name="listName"
          className="input"
          placeholder="List name"
        />
        <button type="submit" className="btn btn-primary">
          Create List
        </button>
      </form>
    </div>
  );
};
