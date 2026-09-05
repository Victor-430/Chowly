import { Select } from '@/components/ui/select';
import { staffMembers } from '@/data/mock-data';
import React from 'react';

interface StaffSelectorProps {
  label: string;
  staffRole: 'chef' | 'bartender';
  value: string;
  onChange: (staffId: string, staffName: string) => void;
}

export function StaffSelector({ label, staffRole, value, onChange }: StaffSelectorProps) {
  const filteredStaff = staffMembers.filter(s => s.role === staffRole);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const staffName = filteredStaff.find(s => s.id === selectedId)?.name || '';
    onChange(selectedId, staffName);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Select value={value || ''} onChange={handleChange as any} className="w-full">
        <option value="" disabled>Select {label}</option>
        {filteredStaff.map(staff => (
          <option key={staff.id} value={staff.id}>
            {staff.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
