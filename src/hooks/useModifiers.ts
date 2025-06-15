
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Modifier = Tables<'modifiers'>;
export type NewModifier = Omit<TablesInsert<'modifiers'>, 'id' | 'created_at' | 'updated_at'>;

const mapDbToModifier = (modifier: any): Modifier => ({
    id: modifier.id,
    name: modifier.name,
    description: modifier.description ?? '',
    price: modifier.price ?? 0,
    category: modifier.category,
    is_active: modifier.is_active ?? true,
    applicable_items: modifier.applicable_items ?? [],
    modifier_type: modifier.modifier_type,
    max_quantity: modifier.max_quantity ?? 1,
    is_required: modifier.is_required ?? false,
    sort_order: modifier.sort_order ?? 0,
    created_at: modifier.created_at,
    updated_at: modifier.updated_at,
});


export function useModifiers() {
    const [modifiers, setModifiers] = useState<Modifier[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchModifiers = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('modifiers')
            .select('*')
            .order('sort_order', { ascending: true })
            .order('name', { ascending: true });

        if (error) {
            toast({
                title: 'Error fetching modifiers',
                description: error.message,
                variant: 'destructive',
            });
            setModifiers([]);
        } else {
            setModifiers(data.map(mapDbToModifier));
        }
        setLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchModifiers();
    }, [fetchModifiers]);

    const addModifier = async (modifierData: NewModifier) => {
        if (!modifierData.name?.trim()) {
            toast({
                title: "Validation Error",
                description: "Modifier name is required.",
                variant: "destructive"
            });
            return null;
        }

        setLoading(true);
        const { data, error } = await supabase
            .from('modifiers')
            .insert(modifierData as TablesInsert<'modifiers'>)
            .select()
            .single();
        
        if (error) {
            toast({
                title: 'Error creating modifier',
                description: error.message,
                variant: 'destructive',
            });
            setLoading(false);
            return null;
        }
        
        await fetchModifiers();
        toast({
            title: 'Modifier Created',
            description: `"${modifierData.name}" has been created successfully.`,
        });
        setLoading(false);
        return data ? mapDbToModifier(data) : null;
    };

    const updateModifier = async (id: string, modifierData: TablesUpdate<'modifiers'>) => {
        if (!modifierData.name?.trim()) {
            toast({
                title: "Validation Error",
                description: "Modifier name is required.",
                variant: "destructive"
            });
            return null;
        }

        setLoading(true);
        const { data, error } = await supabase
            .from('modifiers')
            .update({ ...modifierData, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            toast({
                title: 'Error updating modifier',
                description: error.message,
                variant: 'destructive',
            });
            setLoading(false);
            return null;
        }

        await fetchModifiers();
        toast({
            title: 'Modifier Updated',
            description: `"${modifierData.name}" has been updated successfully.`,
        });
        setLoading(false);
        return data ? mapDbToModifier(data) : null;
    };
    
    const deleteModifier = async (id: string) => {
        setLoading(true);
        const { error } = await supabase
            .from('modifiers')
            .delete()
            .eq('id', id);

        if (error) {
            toast({
                title: 'Error deleting modifier',
                description: error.message,
                variant: 'destructive',
            });
            setLoading(false);
            return;
        }

        await fetchModifiers();
        toast({
            title: 'Modifier Deleted',
            description: 'The modifier has been deleted successfully.',
        });
        setLoading(false);
    };

    const toggleModifierActive = async (id: string, currentState: boolean) => {
        setLoading(true);
        const { error } = await supabase
            .from('modifiers')
            .update({ is_active: !currentState, updated_at: new Date().toISOString() })
            .eq('id', id);
        
        if (error) {
            toast({
                title: 'Error updating status',
                description: error.message,
                variant: 'destructive',
            });
        }
        
        await fetchModifiers();
        setLoading(false);
    };

    return { modifiers, loading, addModifier, updateModifier, deleteModifier, toggleModifierActive };
}
