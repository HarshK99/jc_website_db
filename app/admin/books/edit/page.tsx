import BookForm from '../../../../components/BookForm';

interface EditBookPageProps {
  searchParams: { id?: string };
}

export default function EditBookPage({ searchParams }: EditBookPageProps) {
  return <BookForm mode="edit" bookId={searchParams.id} />;
}