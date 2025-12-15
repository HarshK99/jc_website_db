import CurrentAffairsForm from '../../../../../components/CurrentAffairsForm';

interface EditCurrentAffairsPageProps {
  params: {
    id: string;
  };
}

export default function EditCurrentAffairsPage({ params }: EditCurrentAffairsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CurrentAffairsForm mode="edit" currentAffairsId={params.id} />
    </div>
  );
}