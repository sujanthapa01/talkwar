'use client'

import React, { useEffect } from 'react'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
} from '@heroui/navbar'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown'

import { useUser } from '@/context/userContext'

export const Navigation = () => {
  const currUser = useUser()




  useEffect(() => {
    if (currUser) {
      console.log('User loaded:', currUser)
    }
  }, [currUser])

  return (
    <Navbar className="w-full justify-end bg-transparent shadow-sm">
      <NavbarContent justify="end" className="px-4">
        {currUser ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <img
                src={currUser?.user?.avatarUrl}
                alt="profile"
                className="h-8 w-8 rounded-full cursor-pointer p-[.5px] border-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold text-sm">Signed in as</p>
                <p className="font-semibold text-sm text-gray-500">{currUser?.user?.email}</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={currUser?.handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full" />
        )}
      </NavbarContent>
    </Navbar>
  )
}
