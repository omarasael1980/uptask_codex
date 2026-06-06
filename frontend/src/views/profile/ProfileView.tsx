import ProfileForm from "@/components/profiles/ProfileForm";
import { useAuth } from "@/hooks/useAuth";
export default function ProfileView() {
  const { data, isLoading } = useAuth();

  if (isLoading) return <h1>Loading...</h1>;
  if (data)
    return (
      <div>
        <ProfileForm data={data} />
      </div>
    );
}
