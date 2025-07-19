import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Bars3Icon as GripVerticalIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Question } from '../services/formService';

interface DraggableQuestionListProps {
  questions: Question[];
  onQuestionsReorder: (reorderedQuestions: Question[]) => void;
  onQuestionRemove: (index: number) => void;
  renderQuestionContent: (question: Question, index: number) => React.ReactNode;
}

const DraggableQuestionList: React.FC<DraggableQuestionListProps> = ({
  questions,
  onQuestionsReorder,
  onQuestionRemove,
  renderQuestionContent
}) => {
  const handleDragEnd = (result: DropResult) => {
    // If dropped outside the list or no destination, do nothing
    if (!result.destination) {
      return;
    }

    // If the item was dropped in the same position, do nothing
    if (result.destination.index === result.source.index) {
      return;
    }

    // Reorder the questions array
    const reorderedQuestions = [...questions];
    const [movedQuestion] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, movedQuestion);

    // Call the callback with the reordered questions
    onQuestionsReorder(reorderedQuestions);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="questions">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-6"
          >
            {questions.map((question, index) => (
              <Draggable 
                key={`question-${index}`} 
                draggableId={`question-${index}`} 
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`bg-gray-50 p-6 rounded-lg shadow-sm ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div 
                          {...provided.dragHandleProps}
                          className="p-1 mr-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                        >
                          <GripVerticalIcon className="h-5 w-5" />
                        </div>
                        <h4 className="text-md font-medium text-gray-700">Question {index + 1}</h4>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => onQuestionRemove(index)}
                          disabled={questions.length <= 1}
                          className={`p-1 rounded-full ${questions.length <= 1 ? 'text-gray-300' : 'text-red-500 hover:bg-red-100'}`}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    {renderQuestionContent(question, index)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableQuestionList;