'use client';

import RolesService from '@/lib/services/roles.service';
import { useQuery } from '@tanstack/react-query';

const ParametersPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['roles'],
    queryFn: () => RolesService.getRoles(),
  });
  return (
    <div>Parameters Page</div>
  );
}

export default ParametersPage;
