export interface ParentSupportService {
  getEducationalGames(): Promise<never[]>;
  getEmotionalRegulationActivities(): Promise<never[]>;
  getDailyGuidance(): Promise<never[]>;
  getResources(): Promise<never[]>;
}

export class FutureParentSupportService implements ParentSupportService {
  async getEducationalGames() { return []; }
  async getEmotionalRegulationActivities() { return []; }
  async getDailyGuidance() { return []; }
  async getResources() { return []; }
}
