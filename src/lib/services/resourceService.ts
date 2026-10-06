import { ResponseResource } from "@/data/demo/resources";

export interface IResourceService {
  getResources(category?: string): Promise<ResponseResource[]>;
  getResourceById(id: string): Promise<ResponseResource | null>;
}

export class ResourceService implements IResourceService {
  async getResources(category?: string): Promise<ResponseResource[]> {
    void category;
    return [];
  }

  async getResourceById(id: string): Promise<ResponseResource | null> {
    void id;
    return null;
  }
}

export const resourceService = new ResourceService();
