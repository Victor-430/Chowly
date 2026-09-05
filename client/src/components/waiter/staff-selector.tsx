import { useEffect, useState } from 'react';
import { Select } from '@/components/ui/select';
import { staffMembers as fallbackStaffMembers } from '@/data/mock-data';
import { staffApi } from '@/services/staff.api';
import { useRestaurantStore } from '@/stores/restaurant-store';
import type { StaffMember } from '@/types';
import React from 'react';

interface StaffSelectorProps {
  label: string;
  staffRole: 'chef' | 'bartender';
  value: string;
  onChange: (staffId: string, staffName: string) => void;
}

export function StaffSelector({ label, staffRole, value, onChange }: StaffSelectorProps) {
  const { restaurant } = useRestaurantStore();
  const [staffList, setStaffList] = useState<StaffMember[]>(() =>
    fallbackStaffMembers.filter((s) => s.role === staffRole)
  );

  useEffect(() => {
    let isMounted = true;
    staffApi
      .list(restaurant.id, staffRole)
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setStaffList(data);
        }
      })
      .catch((err) => {
        console.warn(`Could not load live ${staffRole} staff:`, err);
      });

    return () => {
      isMounted = false;
    };
  }, [restaurant.id, staffRole]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const staffName = staffList.find((s) => s.id === selectedId)?.name || '';
    onChange(selectedId, staffName);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Select value={value || ''} onChange={handleChange as any} className="w-full">
        <option value="" disabled>Select {label}</option>
        {staffList.map((staff) => (
          <option key={staff.id} value={staff.id}>
            {staff.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
