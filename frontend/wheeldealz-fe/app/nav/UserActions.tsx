'use client';

import { Dropdown } from 'flowbite-react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter} from 'next/navigation';
import React from 'react';
import { AiFillCar, AiFillTrophy, AiOutlineLogout } from 'react-icons/ai';
import { HiCog, HiUser } from 'react-icons/hi';
import { useParamsStore } from '../hooks/useParamsStore';

type Props = {
  user: Session['user']
};


export default function UserActions({ user }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const setParams = useParamsStore(state => state.setParams);

  const setWinner = (user: { username?: string | null }) => {
    setParams({
      // If user.name is null or undefined, it will set winner to undefined
      winner: user.username ?? undefined,
      seller: undefined
    });
    if (pathname !== '/') router.push('/');
  };
  
  const setSeller = (user: { username?: string | null }) => {
    setParams({
      winner: undefined,
      // If user.name is null or undefined, it will set seller to undefined
      seller: user.username ?? undefined
    });
    if (pathname !== '/') router.push('/');
  };
  


  return (
  
  <Dropdown inline label={ `Welcome ${user.name}`} >
  
    <Dropdown.Item icon={HiUser} onClick={ () => setSeller(user) }>
      My Auctions
    </Dropdown.Item>

    <Dropdown.Item icon={AiFillTrophy} onClick={ () => setWinner(user) }>
      Auctions won
    </Dropdown.Item>

    <Dropdown.Item icon={AiFillCar}>
      <Link href='/auctions/create'>
        Create new Auction
      </Link>
    </Dropdown.Item>

    <Dropdown.Divider />

    <Dropdown.Item icon={HiCog}>
      <Link href='/session'>
        Session (dev only)    {/* todo */} 
      </Link>
    </Dropdown.Item>

    <Dropdown.Divider />

    <Dropdown.Item icon={AiOutlineLogout} onClick={ () => signOut({ callbackUrl: '/' })}>
      Sign out
    </Dropdown.Item>

  </Dropdown>
  );
}
