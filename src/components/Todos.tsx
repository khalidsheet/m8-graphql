'use client';

import { useState } from 'react';
import { Heart } from '@/components/icons/Heart';
import { Close } from '@/components/icons/Close';
import { AddTodo } from '@/components/AddTodo';
import { gql } from 'graphql-request';
import { client } from '@/lib/client';

export type Todo = {
  id: number;
  desc: string;
  finished: boolean;
};

type TodosProps = {
  listId: number;
  list: Todo[];
};

const ADD_TODO = gql`
  mutation Mutation($listId: Int!, $desc: String!) {
    addTODO(listId: $listId, desc: $desc) {
      id
    }
  }
`;

const FINISH_TODO = gql`
  mutation FinishTODO($finishTodoId: Int!, $finishTodoListId2: Int!) {
    finishTODO(id: $finishTodoId, listId: $finishTodoListId2) {
      id
    }
  }
`;

const REMOVE_TODO = gql`
  mutation RemoveTODO($removeTodoId: Int!, $removeTodoListId2: Int!) {
    removeTODO(id: $removeTodoId, listId: $removeTodoListId2)
  }
`;

export const Todos = ({ list = [], listId }: TodosProps) => {
  const [todos, setTodos] = useState<Todo[]>(list);

  const onAddHandler = async (desc: string) => {
    const lastId = todos[todos.length - 1]?.id ?? 0;

    setTodos([
      ...todos,
      {
        id: lastId + 1,
        desc,
        finished: false,
      },
    ]);

    await client.request(ADD_TODO, {
      listId,
      desc,
    });
  };

  const onRemoveHandler = async (id: number) => {
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos([...newTodos]);

    await client.request(REMOVE_TODO, {
      removeTodoListId2: listId,
      removeTodoId: id,
    });
  };

  const onFinishHandler = async (id: number) => {
    const newTodos = todos.filter((item) => {
      if (item.id === id) {
        item.finished = true;
        return item;
      }

      return item;
    });

    setTodos([...newTodos]);

    await client.request(FINISH_TODO, {
      finishTodoListId2: listId,
      finishTodoId: id,
    });
  };

  return (
    <div>
      <h2 className="text-center text-5xl mb-10">My TODO list</h2>
      <ul>
        {todos.map((item) => (
          <li
            key={item.id}
            className="py-2 pl-4 pr-2 bg-gray-900 rounded-lg mb-4 flex justify-between items-center min-h-16"
          >
            <p className={item.finished ? 'line-through' : ''}>{item.desc}</p>

            <div className="flex gap-2">
              {!item.finished && (
                <button
                  className="btn btn-square btn-accent"
                  onClick={() => onFinishHandler(item.id)}
                >
                  <Heart />
                </button>
              )}
              <button
                className="btn btn-square btn-error"
                onClick={() => onRemoveHandler(item.id)}
              >
                <Close />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <AddTodo onAdd={onAddHandler} />
    </div>
  );
};
