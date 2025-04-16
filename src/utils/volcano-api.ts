import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Classe API wrapper utilisant Axios
export class VolcaniaAPI {
    private axios: AxiosInstance;

    constructor(baseURL: string = '/api') {
        this.axios = axios.create({
            baseURL,
            // Vous pouvez ajouter ici des headers par défaut, de l'authentification, etc.
        });
    }

    // Récupère un volcan par son ID
    public async getVolcano(id: number): Promise<Volcano> {
        const response: AxiosResponse<Volcano> = await this.axios.get(`/volcano/${id}`);
        return response.data;
    }

    // Récupère la liste de tous les volcans
    public async getVolcanoes(): Promise<Volcano[]> {
        const response: AxiosResponse<Volcano[]> = await this.axios.get(`/volcano/all`);
        return response.data;
    }

    // Récupère les dix volcans avec la plus grande élévation
    public async getTenHighest(): Promise<Volcano[]> {
        const response: AxiosResponse<Volcano[]> = await this.axios.get(`/volcano/highest`);
        return response.data;
    }

    // Récupère les dix volcans avec la plus faible élévation
    public async getTenLowest(): Promise<Volcano[]> {
        const response: AxiosResponse<Volcano[]> = await this.axios.get(`/volcano/lowest`);
        return response.data;
    }

    // Récupère les dix volcans ayant eu la plus récente activité (selon la date de dernière éruption)
    public async getTenRecentActivity(): Promise<Volcano[]> {
        const response: AxiosResponse<Volcano[]> = await this.axios.get(`/volcano/most-recent-activity`);
        return response.data;
    }

    // Récupère les dix volcans européens avec la plus récente activité
    public async getTenMostRecentEuropeanActivities(): Promise<Volcano[]> {
        const response: AxiosResponse<Volcano[]> = await this.axios.get(`/volcano/most-recent-activity/europe`);
        return response.data;
    }

    // Récupère les dix volcans américains avec la plus récente activité
    public async getTenMostRecentAmericanActivities(): Promise<Volcano[]> {
        const response: AxiosResponse<Volcano[]> = await this.axios.get(`/volcano/most-recent-activity/america`);
        return response.data;
    }

    // Récupère les dix volcans de type "Stratovolcano" classés par élévation décroissante
    public async getTenMostRecentStratovolcanoActivities(): Promise<Volcano[]> {
        const response: AxiosResponse<Volcano[]> = await this.axios.get(`/volcano/highest/stratovolcano`);
        return response.data;
    }
}
