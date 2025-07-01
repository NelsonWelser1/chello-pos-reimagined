
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function SampleDataInitializer() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    checkForExistingData();
  }, []);

  const checkForExistingData = async () => {
    try {
      const { data, error } = await supabase
        .from('tables')
        .select('id')
        .limit(1);

      if (error) {
        console.error('Error checking for existing data:', error);
        return;
      }

      setHasData((data || []).length > 0);
    } catch (error) {
      console.error('Error checking for existing data:', error);
    }
  };

  const initializeSampleData = async () => {
    setIsInitializing(true);
    
    try {
      // Sample tables data
      const sampleTables = [
        {
          number: 1,
          seats: 4,
          status: 'available',
          shape: 'round',
          location: 'Main Floor',
          position_x: 50,
          position_y: 50,
          notes: 'Window table with garden view'
        },
        {
          number: 2,
          seats: 2,
          status: 'occupied',
          shape: 'square',
          location: 'Main Floor',
          position_x: 200,
          position_y: 50,
          notes: 'Cozy corner table'
        },
        {
          number: 3,
          seats: 6,
          status: 'reserved',
          shape: 'rectangle',
          location: 'Main Floor',
          position_x: 350,
          position_y: 50,
          notes: 'Large family table'
        },
        {
          number: 4,
          seats: 4,
          status: 'cleaning',
          shape: 'round',
          location: 'Patio',
          position_x: 50,
          position_y: 200,
          notes: 'Outdoor seating'
        },
        {
          number: 5,
          seats: 8,
          status: 'available',
          shape: 'rectangle',
          location: 'Private Room',
          position_x: 200,
          position_y: 200,
          notes: 'VIP dining area'
        },
        {
          number: 6,
          seats: 2,
          status: 'occupied',
          shape: 'square',
          location: 'Bar Area',
          position_x: 350,
          position_y: 200,
          notes: 'High-top table'
        }
      ];

      console.log('Inserting sample tables...');
      const { data: insertedTables, error: tablesError } = await supabase
        .from('tables')
        .insert(sampleTables)
        .select();

      if (tablesError) {
        console.error('Error inserting sample tables:', tablesError);
        throw tablesError;
      }

      console.log('Sample tables inserted:', insertedTables);

      // Add sample table sessions for occupied tables
      if (insertedTables && insertedTables.length > 0) {
        const occupiedTables = insertedTables.filter(table => table.status === 'occupied');
        
        const sampleSessions = occupiedTables.map(table => ({
          table_id: table.id,
          customer_name: table.number === 2 ? 'Johnson Family' : 'Smith Party',
          party_size: table.number === 2 ? 2 : 4,
          status: 'active' as const,
          notes: table.number === 2 ? 'Anniversary dinner' : 'Birthday celebration'
        }));

        if (sampleSessions.length > 0) {
          console.log('Inserting sample table sessions...');
          const { data: insertedSessions, error: sessionsError } = await supabase
            .from('table_sessions')
            .insert(sampleSessions)
            .select();

          if (sessionsError) {
            console.error('Error inserting sample sessions:', sessionsError);
            throw sessionsError;
          }

          console.log('Sample table sessions inserted:', insertedSessions);
        }
      }

      toast.success('Sample data initialized successfully!');
      setHasData(true);
    } catch (error) {
      console.error('Error initializing sample data:', error);
      toast.error('Failed to initialize sample data');
    } finally {
      setIsInitializing(false);
    }
  };

  if (hasData) {
    return null; // Don't show the initializer if data already exists
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Initialize Sample Data</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          It looks like you don't have any tables set up yet. Would you like to initialize with some sample data to get started?
        </p>
        <Button 
          onClick={initializeSampleData} 
          disabled={isInitializing}
          className="w-full"
        >
          {isInitializing ? 'Initializing...' : 'Initialize Sample Data'}
        </Button>
      </CardContent>
    </Card>
  );
}
