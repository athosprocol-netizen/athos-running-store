import { supabase } from './supabase';

const VISITOR_KEY = 'athos_visitor_id';

export const getOrCreateVisitorId = () => {
    let visitorId = localStorage.getItem(VISITOR_KEY);
    if (!visitorId) {
        visitorId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
        localStorage.setItem(VISITOR_KEY, visitorId);
    }
    return visitorId;
};

export const registerVisit = async () => {
    try {
        const visitorId = getOrCreateVisitorId();
        
        // Evitamos saturar la DB si ya se registró la visita en esta pestaña/sesión
        if (sessionStorage.getItem('athos_visit_registered')) {
            return;
        }

        // Insertamos la vista (Supabase backend)
        const { error } = await supabase.from('page_visits').insert({
            visitor_id: visitorId,
            page: 'home'
        });

        if (!error) {
            sessionStorage.setItem('athos_visit_registered', 'true');
        } else {
            console.error("Supabase Analytics Error:", error);
        }
    } catch (e) {
        console.error("Error al registrar visita:", e);
    }
};

export const getUniqueVisitorCount = async (): Promise<number> => {
    try {
        // En supabase si no usamos un RPC, la forma mas eficiente es contar filas
        const { count, error } = await supabase
            .from('page_visits')
            .select('*', { count: 'exact', head: true });
            
        if (error) {
            console.warn("Fallo al obtener conteo:", error);
            // Si la tabla no existe aún, evitamos crashear y devolvemos 0
            return 0;
        }
        return count || 0;
    } catch (e) {
        console.error("Error consultando visitas:", e);
        return 0;
    }
};
