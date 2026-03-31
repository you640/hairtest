import { useState, useEffect } from 'react';
import { useBuilderStore } from '@/src/lib/builderStore';
import { auth } from '@/src/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const ProjectArchive = () => {
  const [projects, setProjects] = useState<{ id: string; name: string; createdAt: string }[]>([]);
  const { loadProject } = useBuilderStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const listProjects = useBuilderStore.getState().listProjects;
        const projectList = await listProjects();
        setProjects(projectList);
      } else {
        setProjects([]);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className="p-4 border rounded-md bg-background">
      <h2 className="text-sm font-bold mb-4">Project Archive</h2>
      {projects.length === 0 ? (
        <p className="text-xs text-muted-foreground">No projects saved yet.</p>
      ) : (
        <ul className="space-y-2">
          {projects.map((project) => (
            <li key={project.id} className="flex justify-between items-center text-xs">
              <span>{project.name}</span>
              <button 
                onClick={() => loadProject(project.id)}
                className="px-2 py-1 border rounded hover:bg-muted"
              >
                Load
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
