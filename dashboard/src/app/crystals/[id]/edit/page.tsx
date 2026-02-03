/**
 * CRYSTAL EDIT PAGE 📝
 * 
 * Collaborative editing page for crystals
 */

'use client';

import CollaborativeEditor from '@/components/CollaborativeEditor';
import { useParams } from 'next/navigation';

export default function CrystalEditPage() {
    const params = useParams();
    const crystalId = params.id as string;

    const handleSave = async (content: string) => {
        // Save to backend
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/crystals/${crystalId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content
                })
            });

            if (response.ok) {
                console.log('[Editor] Saved successfully');
            }
        } catch (error) {
            console.error('[Editor] Save failed:', error);
        }
    };

    return (
        <CollaborativeEditor
            crystalId={crystalId}
            onSave={handleSave}
        />
    );
}
