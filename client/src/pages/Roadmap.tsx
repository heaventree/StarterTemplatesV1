import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Task } from '@shared/schema';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';

// Task priority badges
const PriorityBadge = ({ priority }: { priority: string }) => {
  if (priority === 'high') {
    return (
      <Badge variant="destructive" className="ml-2">
        High Priority
      </Badge>
    );
  } else if (priority === 'medium') {
    return (
      <Badge variant="default" className="ml-2">
        Medium Priority
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="ml-2">
        Low Priority
      </Badge>
    );
  }
};

// Task status badges with icons
const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'completed') {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
        <CheckSquare className="h-3 w-3 mr-1" /> Completed
      </Badge>
    );
  } else if (status === 'in-progress') {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center">
        <Clock className="h-3 w-3 mr-1" /> In Progress
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center">
        <AlertCircle className="h-3 w-3 mr-1" /> To Do
      </Badge>
    );
  }
};

// Task card component
const TaskCard = ({ task }: { task: Task }) => {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <StatusBadge status={task.status} />
        </div>
        <CardDescription className="flex items-center">
          {task.category}
          <PriorityBadge priority={task.priority} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{task.description || 'No description provided.'}</p>
        {task.dueDate && (
          <div className="text-xs text-gray-500">
            Due: {new Date(task.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Task list component
const TaskList = ({ tasks, category }: { tasks: Task[], category?: string }) => {
  const filteredTasks = category ? tasks.filter(task => task.category === category) : tasks;
  
  if (filteredTasks.length === 0) {
    return <p className="text-center text-gray-500 my-8">No tasks found in this category.</p>;
  }
  
  return (
    <div className="space-y-4">
      {filteredTasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

// Loading skeleton
const TaskSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <Card key={index} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-5 w-[100px]" />
          </div>
          <Skeleton className="h-4 w-[150px] mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-[80%] mb-3" />
          <Skeleton className="h-3 w-[120px]" />
        </CardContent>
      </Card>
    ))}
  </div>
);

// Phase section component
const PhaseSection = ({ phase, tasks, isLoading }: { phase: string, tasks: Task[], isLoading: boolean }) => {
  const phaseTasks = tasks.filter(task => task.phase === phase);
  const categorySet = new Set<string>();
  phaseTasks.forEach(task => {
    if (task.category) {
      categorySet.add(task.category);
    }
  });
  const categories = Array.from(categorySet);
  
  return (
    <Tabs defaultValue={categories.length > 0 ? categories[0] : 'all'} className="w-full">
      <TabsList className="mb-4 flex flex-wrap">
        <TabsTrigger value="all">All</TabsTrigger>
        {categories.map(category => (
          <TabsTrigger key={category} value={category}>
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value="all">
        {isLoading ? <TaskSkeleton /> : <TaskList tasks={phaseTasks} />}
      </TabsContent>
      
      {categories.map(category => (
        <TabsContent key={category} value={category}>
          {isLoading ? <TaskSkeleton /> : <TaskList tasks={phaseTasks} category={category} />}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default function Roadmap() {
  const [activePhase, setActivePhase] = useState('Phase 1');
  const phases = ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'];
  
  const { data: tasksData = [], isLoading } = useQuery({
    queryKey: ['/api/tasks'],
    staleTime: 60000, // 1 minute
  });
  
  // Type assertion to handle tasks
  const tasks = tasksData as Task[];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">CMS Roadmap</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our plan for developing a comprehensive Content Management System for StarterTemplates.
            </p>
          </div>
          
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {phases.map(phase => (
                <Button
                  key={phase}
                  variant={activePhase === phase ? "default" : "outline"}
                  onClick={() => setActivePhase(phase)}
                  className="min-w-[120px]"
                >
                  {phase}
                </Button>
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>{activePhase}</CardTitle>
                <CardDescription>
                  {activePhase === 'Phase 1' && 'Foundation (Q2 2025) - Setting up core functionality.'}
                  {activePhase === 'Phase 2' && 'Enhanced Features (Q3 2025) - Adding advanced capabilities.'}
                  {activePhase === 'Phase 3' && 'Integration & Scaling (Q4 2025) - Expanding functionality.'}
                  {activePhase === 'Phase 4' && 'Advanced Features (Q1 2026) - Polishing and enhancing.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PhaseSection phase={activePhase} tasks={tasks} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}