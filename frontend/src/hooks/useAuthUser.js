import React from 'react'
import { getAuthUser } from '../lib/api';
import { useQuery } from '@tanstack/react-query';

const useAuthUser = () => {
  //! react query setup
  //! custom hook is created and the code from app.js is transferred here to make it look cleaner and make it readable
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,    //! auth check only once

    staleTime: 0 //! quick refetch
  });

  return { isLoading: authUser.isLoading, authUser: authUser.data?.user, refetch: authUser.refetch }
}


export default useAuthUser