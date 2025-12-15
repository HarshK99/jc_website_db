import CurrentAffairsForm from '../../../../../components/CurrentAffairsForm';

interface EditCurrentAffairsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCurrentAffairsPage({ params }: EditCurrentAffairsPageProps) {
  const resolvedParams = await params;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CurrentAffairsForm mode="edit" currentAffairsId={resolvedParams.id} />
    </div>
  );
}