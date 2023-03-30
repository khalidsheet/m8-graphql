'use client';

import Link from 'next/link';
import classNames from 'classnames';
import { CreateList } from '@/components/CreateList';
import { randomColor } from '@/utils/randomColor';
import { useState } from 'react';
import { Close } from './icons/Close';
import { gql } from 'graphql-request';
import { client } from '@/lib/client';

export type TodoList = {
  id: number;
  created_at: string;
  name: string;
  email: string;
};

type MyListsProps = {
  list: TodoList[];
};

const DELETE_LIST = gql`
  mutation DeleteList($deleteListId: Int!) {
    deleteList(id: $deleteListId)
  }
`;

export const MyLists = ({ list = [] }: MyListsProps) => {
  const [todoLists, setTodoLists] = useState<TodoList[]>(list);

  const onCreateHandler = (newTodoList: TodoList) => {
    // get last id
    const lastId = todoLists[todoLists.length - 1]?.id ?? 0;
    // add new list to state
    newTodoList.id = lastId + 1;

    setTodoLists([...todoLists, newTodoList]);
  };

  const onDeletedHandler = async (id: string) => {
    // TODO: delete list with query
    // Update state with new list
    setTodoLists(todoLists.filter((item) => item.id.toString() !== id));

    await client.request(DELETE_LIST, {
      deleteListId: parseInt(id),
    });
  };

  return (
    <div className="flex flex-col gap-8 text-center">
      <h1 className="text-4xl">
        {todoLists.length > 0 ? 'My TODO lists' : 'No lists yet!'}
      </h1>
      <ul>
        {todoLists.map((item) => (
          <li
            key={item.id}
            className={classNames(
              'py-2 pl-4 pr-2 bg-gray-900 rounded-lg mb-4 flex justify-between items-center min-h-16 text-black hover:scale-[1.02] transform transition duration-300 ease-in-out',
              randomColor(),
            )}
          >
            <Link
              href={item.id.toString()}
              className={classNames(
                ' pl-4 pr-2 bg-gray-900 rounded-lg flex-1 justify-start items-start text-left',
                randomColor(),
              )}
            >
              {item.name}
            </Link>
            <div className="flex gap-2 z-30">
              <button
                className="btn btn-square btn-error"
                onClick={() => onDeletedHandler(item.id.toString())}
              >
                <Close />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <CreateList onCreate={onCreateHandler} />
    </div>
  );
};
