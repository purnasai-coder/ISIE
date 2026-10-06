import { ResponseResource, DEMO_RESOURCES } from "@/data/demo/resources";

export interface IResourceService {
  getResources(category?: string): Promise<ResponseResource[]>;
  getResourceById(id: string): Promise<ResponseResource | null>;
}

export class ResourceService implements IResourceService {
  async getResources(category?: string): Promise<ResponseResource[]> {
    if (!category || category === "ALL") {
      return DEMO_RESOURCES;
    }
    return DEMO_RESOURCES.filter((r) => r.category === category);
  }

  async getResourceById(id: string): Promise<ResponseResource | null> {
    return DEMO_RESOURCES.find((r) => r.id === id) || null;
  }
}

export const resourceService = new ResourceService();
