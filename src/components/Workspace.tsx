import { Icon } from '@iconify/react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Leaderboard from './Leaderboard';
import Dropdown from './Dropdown';

interface WorkspaceProps {
  onRegisterHandlers?: (handlers: {
    onCreateWorkspace: () => void;
    onJoinWorkspace: () => void;
  }) => void;
  onWorkspaceChange?: (workspace: Workspace) => void;
}

export interface Workspace {
  id: string;
  name: string;
  logo_url: string | null;
  address: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  profile: string | null;
  show_leaderboard: boolean;
  created_at: string;
  updated_at: string;
}

interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_email: string;
  user_name: string;
  avatar_url: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}

interface WorkspaceActivity {
  id: string;
  workspace_id: string;
  user_name: string;
  avatar_url: string;
  action: string;
  details: string | null;
  created_at: string;
}

const mockWorkspaces: Workspace[] = [
  {
    id: '1',
    name: 'AdMore Media Inc.',
    logo_url: 'https://ryuxwkawbokdgvkiwzqd.supabase.co/storage/v1/object/public/site-asset/Screenshot%202025-12-08%20at%2010.56.59%20PM.png',
    address: '123 Business Street, Bangkok 10110, Thailand',
    website: 'admoremedia.com',
    phone: '+66 2 123 4567',
    email: 'hello@admoremedia.com',
    profile: 'A modern business solutions company focused on delivering exceptional value through innovative technology and outstanding customer service.',
    show_leaderboard: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-12-30T10:00:00Z',
  },
  {
    id: '2',
    name: 'ROCCO Furnishings Ltd. Co.',
    logo_url: 'https://ryuxwkawbokdgvkiwzqd.supabase.co/storage/v1/object/public/site-asset/Rocco_Fa.png',
    address: '456 Innovation Drive, San Francisco, CA 94105',
    website: 'roccofurnishings.com',
    phone: '+1 415 555 0123',
    email: 'contact@roccofurnishings.com',
    profile: 'Leading provider of innovative solutions for enterprise businesses worldwide.',
    show_leaderboard: true,
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-12-28T10:00:00Z',
  },
  {
    id: '3',
    name: 'SUGRFIND Incorporatd',
    logo_url: 'https://ryuxwkawbokdgvkiwzqd.supabase.co/storage/v1/object/public/site-asset/Sugrfind%20email%20footer%20(1).png',
    address: '789 Startup Lane, Austin, TX 78701',
    website: 'sugrfind.com',
    phone: '+1 512 555 0456',
    email: 'hello@sugrfind.com',
    profile: 'Empowering startups with cutting-edge technology and innovative software solutions.',
    show_leaderboard: true,
    created_at: '2024-06-10T10:00:00Z',
    updated_at: '2024-12-29T10:00:00Z',
  },
];

const mockMembers: WorkspaceMember[] = [
  {
    id: '1',
    workspace_id: '1',
    user_email: 'fiamma@company.com',
    user_name: 'Fiamma',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    role: 'admin',
    joined_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    workspace_id: '1',
    user_email: 'arrubiomelwyn@gmail.com',
    user_name: 'Melwyn Arrubio',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    role: 'owner',
    joined_at: '2024-02-01T10:00:00Z',
  },
  {
    id: '3',
    workspace_id: '1',
    user_email: 'sarah@fiamma.com',
    user_name: 'Sarah Johnson',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    role: 'member',
    joined_at: '2024-03-15T10:00:00Z',
  },
  {
    id: '4',
    workspace_id: '1',
    user_email: 'mike@fiamma.com',
    user_name: 'Mike Davis',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
    role: 'member',
    joined_at: '2024-04-20T10:00:00Z',
  },
];

const mockActivities: WorkspaceActivity[] = [
  {
    id: '1',
    workspace_id: '1',
    user_name: 'Fiamma',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    action: 'Created workspace',
    details: 'Initial workspace setup',
    created_at: '2024-12-30T08:30:00Z',
  },
  {
    id: '2',
    workspace_id: '1',
    user_name: 'Melwyn Arrubio',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    action: 'Invited team member',
    details: 'Added Sarah Johnson as member',
    created_at: '2024-12-30T09:15:00Z',
  },
  {
    id: '3',
    workspace_id: '1',
    user_name: 'Fiamma',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    action: 'Updated workspace settings',
    details: 'Changed workspace logo',
    created_at: '2024-12-30T10:00:00Z',
  },
  {
    id: '4',
    workspace_id: '1',
    user_name: 'Sarah Johnson',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    action: 'Created invoice',
    details: 'INV-2024-001 for THB 45,000',
    created_at: '2024-12-30T11:20:00Z',
  },
  {
    id: '5',
    workspace_id: '1',
    user_name: 'Melwyn Arrubio',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    action: 'Added product',
    details: 'New product: Premium Package',
    created_at: '2024-12-30T12:45:00Z',
  },
  {
    id: '6',
    workspace_id: '1',
    user_name: 'Mike Davis',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
    action: 'Updated member role',
    details: 'Changed Sarah Johnson to admin',
    created_at: '2024-12-30T13:10:00Z',
  },
];

export default function Workspace({ onRegisterHandlers, onWorkspaceChange }: WorkspaceProps = {}) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(mockWorkspaces[0]);
  const [members, setMembers] = useState<WorkspaceMember[]>(mockMembers);
  const [activities, setActivities] = useState<WorkspaceActivity[]>(mockActivities);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showWorkspaceSwitcher, setShowWorkspaceSwitcher] = useState(false);
  const [showJoinWorkspace, setShowJoinWorkspace] = useState(false);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [showRoleUpdateConfirm, setShowRoleUpdateConfirm] = useState(false);
  const [showRemoveMemberConfirm, setShowRemoveMemberConfirm] = useState(false);
  const [showDeleteWorkspaceConfirm, setShowDeleteWorkspaceConfirm] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Partial<Workspace>>(mockWorkspaces[0]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUserEmail = 'arrubiomelwyn@gmail.com';
  const currentUserMembership = members.find(m => m.user_email === currentUserEmail);
  const isOwner = currentUserMembership?.role === 'owner';

  const [newMember, setNewMember] = useState({
    user_email: '',
    role: 'member' as 'owner' | 'admin' | 'member',
  });

  const [pendingRoleUpdate, setPendingRoleUpdate] = useState<{ memberId: string; newRole: 'owner' | 'admin' | 'member'; memberName: string } | null>(null);
  const [pendingMemberRemoval, setPendingMemberRemoval] = useState<{ memberId: string; memberName: string } | null>(null);
  const [inviteLink, setInviteLink] = useState(`${window.location.origin}/join/${currentWorkspace.id}`);
  const [joinCode, setJoinCode] = useState('');
  const [activityPage, setActivityPage] = useState(1);
  const activityPerPage = 5;

  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    profile: '',
    logo_url: null as string | null,
  });
  const [newWorkspaceLogoPreview, setNewWorkspaceLogoPreview] = useState<string | null>(null);
  const [uploadingNewWorkspaceLogo, setUploadingNewWorkspaceLogo] = useState(false);
  const newWorkspaceFileInputRef = useRef<HTMLInputElement>(null);
  const [openRoleDropdown, setOpenRoleDropdown] = useState<string | null>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditingWorkspace(currentWorkspace);
    setLogoPreview(currentWorkspace.logo_url);
    setInviteLink(`${window.location.origin}/join/${currentWorkspace.id}`);
  }, [currentWorkspace]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showWorkspaceSwitcher) {
        const target = event.target as HTMLElement;
        if (!target.closest('.workspace-switcher-container')) {
          setShowWorkspaceSwitcher(false);
        }
      }
      if (openRoleDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('.role-dropdown-container')) {
          setOpenRoleDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showWorkspaceSwitcher, openRoleDropdown]);

  useEffect(() => {
    if (onRegisterHandlers) {
      onRegisterHandlers({
        onCreateWorkspace: () => setShowCreateWorkspace(true),
        onJoinWorkspace: () => setShowJoinWorkspace(true),
      });
    }
  }, [onRegisterHandlers]);

  useEffect(() => {
    if (onWorkspaceChange) {
      onWorkspaceChange(currentWorkspace);
    }
  }, [currentWorkspace, onWorkspaceChange]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Logo file size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      setUploadingLogo(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setEditingWorkspace({ ...editingWorkspace, logo_url: reader.result as string });
        setUploadingLogo(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setEditingWorkspace({ ...editingWorkspace, logo_url: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveSettings = () => {
    const updatedWorkspace = { ...currentWorkspace, ...editingWorkspace, updated_at: new Date().toISOString() } as Workspace;
    setCurrentWorkspace(updatedWorkspace);
    setWorkspaces(workspaces.map(w => w.id === updatedWorkspace.id ? updatedWorkspace : w));

    const newActivity: WorkspaceActivity = {
      id: String(activities.length + 1),
      workspace_id: currentWorkspace.id,
      user_name: 'Current User',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
      action: 'Updated workspace settings',
      details: 'Changed workspace information',
      created_at: new Date().toISOString(),
    };
    setActivities([newActivity, ...activities]);
    setShowSettings(false);
  };

  const handleAddMember = () => {
    if (!newMember.user_email) {
      alert('Please enter an email address');
      return;
    }

    const avatarUrls = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80',
    ];
    const randomAvatar = avatarUrls[Math.floor(Math.random() * avatarUrls.length)];

    const userName = newMember.user_email.split('@')[0];
    const member: WorkspaceMember = {
      id: String(members.length + 1),
      workspace_id: currentWorkspace.id,
      user_email: newMember.user_email,
      user_name: userName.charAt(0).toUpperCase() + userName.slice(1),
      avatar_url: randomAvatar,
      role: newMember.role,
      joined_at: new Date().toISOString(),
    };

    setMembers([...members, member]);

    const newActivity: WorkspaceActivity = {
      id: String(activities.length + 1),
      workspace_id: currentWorkspace.id,
      user_name: 'Current User',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
      action: 'Invited team member',
      details: `Invited ${newMember.user_email} as ${newMember.role}`,
      created_at: new Date().toISOString(),
    };
    setActivities([newActivity, ...activities]);

    setNewMember({ user_email: '', role: 'member' });
    setShowAddMember(false);
  };

  const handleUpdateMemberRole = (memberId: string, newRole: 'owner' | 'admin' | 'member') => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    setPendingRoleUpdate({ memberId, newRole, memberName: member.user_name });
    setShowRoleUpdateConfirm(true);
  };

  const confirmRoleUpdate = () => {
    if (!pendingRoleUpdate) return;

    const member = members.find((m) => m.id === pendingRoleUpdate.memberId);
    if (!member) return;

    setMembers(members.map(m => m.id === pendingRoleUpdate.memberId ? { ...m, role: pendingRoleUpdate.newRole } : m));

    const newActivity: WorkspaceActivity = {
      id: String(activities.length + 1),
      workspace_id: currentWorkspace.id,
      user_name: 'Current User',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
      action: 'Updated member role',
      details: `Changed ${member.user_name}'s role to ${pendingRoleUpdate.newRole}`,
      created_at: new Date().toISOString(),
    };
    setActivities([newActivity, ...activities]);

    setShowRoleUpdateConfirm(false);
    setPendingRoleUpdate(null);
  };

  const handleRemoveMember = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    setPendingMemberRemoval({ memberId, memberName: member.user_name });
    setShowRemoveMemberConfirm(true);
  };

  const confirmRemoveMember = () => {
    if (!pendingMemberRemoval) return;

    const member = members.find((m) => m.id === pendingMemberRemoval.memberId);
    if (!member) return;

    setMembers(members.filter(m => m.id !== pendingMemberRemoval.memberId));

    const newActivity: WorkspaceActivity = {
      id: String(activities.length + 1),
      workspace_id: currentWorkspace.id,
      user_name: 'Current User',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
      action: 'Removed team member',
      details: `Removed ${member.user_name} from workspace`,
      created_at: new Date().toISOString(),
    };
    setActivities([newActivity, ...activities]);

    setShowRemoveMemberConfirm(false);
    setPendingMemberRemoval(null);
  };

  const handleLeaveWorkspace = () => {
    if (!currentUserMembership) return;

    const newActivity: WorkspaceActivity = {
      id: String(activities.length + 1),
      workspace_id: currentWorkspace.id,
      user_name: currentUserMembership.user_name,
      avatar_url: currentUserMembership.avatar_url,
      action: 'Left workspace',
      details: `${currentUserMembership.user_name} left the workspace`,
      created_at: new Date().toISOString(),
    };
    setActivities([newActivity, ...activities]);
    setMembers(members.filter(m => m.user_email !== currentUserEmail));
    setShowLeaveConfirm(false);
    alert('You have left the workspace');
  };

  const handleSwitchWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      setShowWorkspaceSwitcher(false);
      onWorkspaceChange?.(workspace);
    }
  };

  const handleJoinWorkspace = () => {
    if (!joinCode.trim()) {
      alert('Please enter a workspace code or link');
      return;
    }

    const workspaceId = joinCode.includes('/join/') ? joinCode.split('/join/')[1] : joinCode;
    const workspace = workspaces.find(w => w.id === workspaceId);

    if (!workspace) {
      alert('Invalid workspace code. Please check and try again.');
      return;
    }

    const newActivity: WorkspaceActivity = {
      id: String(activities.length + 1),
      workspace_id: workspace.id,
      user_name: currentUserMembership?.user_name || 'New User',
      avatar_url: currentUserMembership?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
      action: 'Joined workspace',
      details: 'Joined via invite link',
      created_at: new Date().toISOString(),
    };
    setActivities([newActivity, ...activities]);

    setJoinCode('');
    setShowJoinWorkspace(false);
    alert(`Successfully joined ${workspace.name}!`);
  };

  const handleNewWorkspaceLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Logo file size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      setUploadingNewWorkspaceLogo(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewWorkspaceLogoPreview(reader.result as string);
        setNewWorkspace({ ...newWorkspace, logo_url: reader.result as string });
        setUploadingNewWorkspaceLogo(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveNewWorkspaceLogo = () => {
    setNewWorkspaceLogoPreview(null);
    setNewWorkspace({ ...newWorkspace, logo_url: null });
    if (newWorkspaceFileInputRef.current) {
      newWorkspaceFileInputRef.current.value = '';
    }
  };

  const handleCreateWorkspace = () => {
    if (!newWorkspace.name.trim()) {
      alert('Please enter a workspace name');
      return;
    }

    const workspace: Workspace = {
      id: String(workspaces.length + 1),
      name: newWorkspace.name,
      logo_url: newWorkspace.logo_url,
      address: newWorkspace.address || null,
      website: newWorkspace.website || null,
      phone: newWorkspace.phone || null,
      email: newWorkspace.email || null,
      profile: newWorkspace.profile || null,
      show_leaderboard: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setWorkspaces([...workspaces, workspace]);

    const member: WorkspaceMember = {
      id: String(members.length + 1),
      workspace_id: workspace.id,
      user_email: currentUserEmail,
      user_name: currentUserMembership?.user_name || 'Current User',
      avatar_url: currentUserMembership?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
      role: 'owner',
      joined_at: new Date().toISOString(),
    };
    setMembers([...members, member]);

    const newActivity: WorkspaceActivity = {
      id: String(activities.length + 1),
      workspace_id: workspace.id,
      user_name: member.user_name,
      avatar_url: member.avatar_url,
      action: 'Created workspace',
      details: 'Initial workspace setup',
      created_at: new Date().toISOString(),
    };
    setActivities([newActivity, ...activities]);

    setNewWorkspace({
      name: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      profile: '',
      logo_url: null,
    });
    setNewWorkspaceLogoPreview(null);
    setShowCreateWorkspace(false);
    setCurrentWorkspace(workspace);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied to clipboard!');
  };

  const handleDeleteWorkspace = () => {
    const newActivity: WorkspaceActivity = {
      id: String(activities.length + 1),
      workspace_id: currentWorkspace.id,
      user_name: currentUserMembership?.user_name || 'Current User',
      avatar_url: currentUserMembership?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
      action: 'Deleted workspace',
      details: `Workspace ${currentWorkspace.name} was permanently deleted`,
      created_at: new Date().toISOString(),
    };
    setActivities([newActivity, ...activities]);

    setWorkspaces(workspaces.filter(w => w.id !== currentWorkspace.id));
    setShowDeleteWorkspaceConfirm(false);
    setShowSettings(false);

    if (workspaces.length > 1) {
      const remainingWorkspace = workspaces.find(w => w.id !== currentWorkspace.id);
      if (remainingWorkspace) {
        setCurrentWorkspace(remainingWorkspace);
      }
    }

    alert('Workspace has been permanently deleted');
  };

  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-slate-900 text-white border-slate-900';
      case 'admin':
        return 'bg-slate-50 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return 'solar:shield-user-bold';
      case 'member':
        return 'solar:user-bold';
      default:
        return 'solar:user-bold';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'member':
        return 'Member';
      default:
        return 'Member';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  const getActivityIcon = (action: string) => {
    const actionLower = action.toLowerCase();

    if (actionLower.includes('invited') || actionLower.includes('added')) {
      return {
        icon: 'solar:user-plus-rounded-bold',
        iconBg: 'bg-white border-emerald-100',
        iconColor: 'text-emerald-500',
        ringColor: 'ring-emerald-50/50',
      };
    }
    if (actionLower.includes('joined')) {
      return {
        icon: 'solar:login-3-bold',
        iconBg: 'bg-white border-blue-100',
        iconColor: 'text-blue-500',
        ringColor: 'ring-blue-50/50',
      };
    }
    if (actionLower.includes('updated') || actionLower.includes('changed')) {
      return {
        icon: 'solar:pen-new-round-bold',
        iconBg: 'bg-white border-amber-100',
        iconColor: 'text-amber-500',
        ringColor: 'ring-amber-50/50',
      };
    }
    if (actionLower.includes('removed') || actionLower.includes('left')) {
      return {
        icon: 'solar:user-minus-rounded-bold',
        iconBg: 'bg-white border-rose-100',
        iconColor: 'text-rose-500',
        ringColor: 'ring-rose-50/50',
      };
    }
    if (actionLower.includes('created workspace') || actionLower.includes('workspace created')) {
      return {
        icon: 'solar:add-square-bold',
        iconBg: 'bg-white border-purple-100',
        iconColor: 'text-purple-500',
        ringColor: 'ring-purple-50/50',
      };
    }
    if (actionLower.includes('logo') || actionLower.includes('uploaded')) {
      return {
        icon: 'solar:gallery-add-bold',
        iconBg: 'bg-white border-indigo-100',
        iconColor: 'text-indigo-500',
        ringColor: 'ring-indigo-50/50',
      };
    }

    return {
      icon: 'solar:widget-5-bold',
      iconBg: 'bg-white border-slate-100',
      iconColor: 'text-slate-500',
      ringColor: 'ring-slate-50/50',
    };
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setShowWorkspaceSwitcher(!showWorkspaceSwitcher)}
                className="relative group workspace-switcher-container"
              >
                <div className="h-20 w-20 rounded-2xl bg-white border border-slate-100 ring-1 ring-slate-100 shadow-sm overflow-hidden flex items-center justify-center hover:border-slate-300 transition-all hover:shadow-md p-3">
                  {currentWorkspace.logo_url ? (
                    <img
                      src={currentWorkspace.logo_url}
                      alt={currentWorkspace.name}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `<span class="text-2xl font-bold text-slate-600">${currentWorkspace.name.charAt(0)}</span>`;
                      }}
                    />
                  ) : (
                    <span className="text-2xl font-bold text-slate-600">
                      {currentWorkspace.name.charAt(0)}
                    </span>
                  )}
                </div>

                {showWorkspaceSwitcher && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                    <div className="p-3 border-b border-slate-100 bg-slate-50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Switch Workspace</h3>
                        <span className="text-xs text-slate-500">{workspaces.length} workspaces</span>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto p-2">
                      {workspaces.map((workspace) => (
                        <button
                          key={workspace.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSwitchWorkspace(workspace.id);
                          }}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                            workspace.id === currentWorkspace.id
                              ? 'bg-slate-900 text-white shadow-md'
                              : 'hover:bg-slate-50 text-slate-900'
                          }`}
                        >
                          <div className={`h-12 w-12 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 p-2 ${
                            workspace.id === currentWorkspace.id
                              ? 'bg-white/20 border border-white/30'
                              : 'bg-white border border-slate-100'
                          }`}>
                            {workspace.logo_url ? (
                              <img
                                src={workspace.logo_url}
                                alt={workspace.name}
                                className="h-full w-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.parentElement!.innerHTML = `<span class="text-lg font-bold ${workspace.id === currentWorkspace.id ? 'text-white' : 'text-slate-600'}">${workspace.name.charAt(0)}</span>`;
                                }}
                              />
                            ) : (
                              <span className={`text-lg font-bold ${
                                workspace.id === currentWorkspace.id ? 'text-white' : 'text-slate-600'
                              }`}>
                                {workspace.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className={`text-sm font-semibold truncate ${
                              workspace.id === currentWorkspace.id ? 'text-white' : 'text-slate-900'
                            }`}>
                              {workspace.name}
                            </div>
                            <div className={`text-xs truncate ${
                              workspace.id === currentWorkspace.id ? 'text-white/70' : 'text-slate-500'
                            }`}>
                              {workspace.website}
                            </div>
                          </div>
                          {workspace.id === currentWorkspace.id && (
                            <Icon icon="solar:check-circle-bold" width="20" className="text-white flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-slate-900">{currentWorkspace.name}</h2>
                  <button
                    onClick={() => setShowWorkspaceSwitcher(!showWorkspaceSwitcher)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Icon icon="solar:alt-arrow-down-linear" width="20" className="text-slate-400" />
                  </button>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  {currentWorkspace.website && (
                    <a
                      href={`https://${currentWorkspace.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
                    >
                      <Icon icon="solar:link-minimalistic-2-linear" width="14" />
                      {currentWorkspace.website}
                    </a>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Icon icon="solar:users-group-rounded-linear" width="14" />
                    {members.length} members
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateWorkspace(true)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-sm font-medium hover:bg-slate-100 hover:text-slate-700 transition-all"
              >
                <Icon icon="solar:add-square-linear" width="16" />
                <span>Create</span>
              </button>
              <button
                onClick={() => setShowJoinWorkspace(true)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-sm font-medium hover:bg-slate-100 hover:text-slate-700 transition-all"
              >
                <Icon icon="solar:add-circle-linear" width="16" />
                <span>Join</span>
              </button>
              <div className="h-6 w-px bg-slate-200 mx-1"></div>
              <button
                onClick={() => setShowAddMember(true)}
                className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-900 border-2 border-slate-200 hover:border-slate-900 text-slate-900 hover:text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-slate-500/20 active:scale-95"
              >
                <Icon icon="solar:user-plus-linear" width="16" className="group-hover:rotate-12 transition-transform" />
                <span>Invite</span>
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <Icon icon="solar:settings-linear" width="20" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
                Contact Information
              </h3>

              <div className="space-y-4">
                {currentWorkspace.email && (
                  <div className="flex items-start gap-3">
                    <Icon icon="solar:letter-linear" width="18" className="text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs font-medium text-slate-500 mb-1">Email</div>
                      <a href={`mailto:${currentWorkspace.email}`} className="text-sm text-slate-900 hover:text-slate-700 transition-colors">
                        {currentWorkspace.email}
                      </a>
                    </div>
                  </div>
                )}

                {currentWorkspace.phone && (
                  <div className="flex items-start gap-3">
                    <Icon icon="solar:phone-linear" width="18" className="text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs font-medium text-slate-500 mb-1">Phone</div>
                      <a href={`tel:${currentWorkspace.phone}`} className="text-sm text-slate-900 hover:text-slate-700 transition-colors">
                        {currentWorkspace.phone}
                      </a>
                    </div>
                  </div>
                )}

                {currentWorkspace.address && (
                  <div className="flex items-start gap-3">
                    <Icon icon="solar:map-point-linear" width="18" className="text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs font-medium text-slate-500 mb-1">Address</div>
                      <div className="text-sm text-slate-900">{currentWorkspace.address}</div>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-start gap-3">
                    <Icon icon="solar:calendar-linear" width="18" className="text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs font-medium text-slate-500 mb-1">Created On</div>
                      <div className="text-sm text-slate-900">{formatDate(currentWorkspace.created_at)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Team Members
                </h3>
                {!isOwner && (
                  <div className="relative group">
                    <button
                      onClick={() => setShowLeaveConfirm(true)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    >
                      <Icon icon="solar:logout-2-linear" width="18" />
                    </button>
                    <span className="absolute right-0 top-full mt-2 bg-slate-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      Leave workspace
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full overflow-hidden shadow-sm flex-shrink-0 ring-2 ring-white">
                        <img
                          src={member.avatar_url}
                          alt={member.user_name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 truncate">
                            {member.user_name}
                          </span>
                          {member.user_email === currentUserEmail && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-600 uppercase tracking-wide flex-shrink-0">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 truncate">{member.user_email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {member.role === 'owner' ? (
                        <>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 h-[32px] bg-slate-900 border border-slate-900 rounded-lg">
                            <Icon icon="solar:shield-check-bold" width="14" className="text-white" />
                            <span className="text-xs font-semibold text-white tracking-wide">Owner</span>
                          </div>
                          <div className="w-[28px]"></div>
                        </>
                      ) : (
                        <>
                          <div className="relative role-dropdown-container">
                            <button
                              onClick={() => setOpenRoleDropdown(openRoleDropdown === member.id ? null : member.id)}
                              className={`flex items-center gap-2 px-3 py-1.5 h-[32px] rounded-lg text-xs font-semibold border transition-all ${getRoleBadgeStyles(member.role)} hover:border-slate-300`}
                            >
                              <Icon icon={getRoleIcon(member.role)} width="14" />
                              <span>{getRoleLabel(member.role)}</span>
                              <Icon
                                icon="solar:alt-arrow-down-linear"
                                width="12"
                                className={`transition-transform ${openRoleDropdown === member.id ? 'rotate-180' : ''}`}
                              />
                            </button>

                            {openRoleDropdown === member.id && (
                              <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
                                <button
                                  onClick={() => {
                                    handleUpdateMemberRole(member.id, 'admin');
                                    setOpenRoleDropdown(null);
                                  }}
                                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                                    member.role === 'admin'
                                      ? 'bg-slate-50 text-slate-900'
                                      : 'text-slate-700 hover:bg-slate-50'
                                  }`}
                                >
                                  <Icon icon="solar:shield-user-bold" width="16" className="text-slate-500" />
                                  <span className="flex-1">Admin</span>
                                  {member.role === 'admin' && (
                                    <Icon icon="solar:check-circle-bold" width="14" className="text-slate-900" />
                                  )}
                                </button>
                                <button
                                  onClick={() => {
                                    handleUpdateMemberRole(member.id, 'member');
                                    setOpenRoleDropdown(null);
                                  }}
                                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                                    member.role === 'member'
                                      ? 'bg-slate-50 text-slate-900'
                                      : 'text-slate-700 hover:bg-slate-50'
                                  }`}
                                >
                                  <Icon icon="solar:user-bold" width="16" className="text-slate-500" />
                                  <span className="flex-1">Member</span>
                                  {member.role === 'member' && (
                                    <Icon icon="solar:check-circle-bold" width="14" className="text-slate-900" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Icon icon="solar:trash-bin-trash-linear" width="16" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {currentWorkspace.show_leaderboard && <Leaderboard />}

          {currentWorkspace.profile && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                Company Profile
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">{currentWorkspace.profile}</p>
            </div>
          )}

          <div id="workspace-activity" className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden scroll-mt-6">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Recent Activity
              </h3>
            </div>

            <div className="p-6 space-y-6 relative min-h-[400px]">
              {activities.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Icon icon="solar:history-linear" width="32" className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No activity yet</p>
                </div>
              ) : (
                <>
                  <div className="absolute left-[38px] top-6 bottom-6 w-px bg-slate-200/60"></div>
                  {activities
                    .slice((activityPage - 1) * activityPerPage, activityPage * activityPerPage)
                    .map((activity) => {
                      const iconConfig = getActivityIcon(activity.action);
                      return (
                        <div key={activity.id} className="relative flex gap-4">
                          <div className="relative z-10 flex-shrink-0 mt-0.5">
                            <div
                              className={`h-8 w-8 rounded-full ${iconConfig.iconBg} border flex items-center justify-center ${iconConfig.iconColor} shadow-lg ring-4 ${iconConfig.ringColor}`}
                            >
                              <Icon icon={iconConfig.icon} width="14" />
                            </div>
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-slate-900">{activity.action}</p>
                              <span className="text-xs text-slate-400 flex-shrink-0">
                                {formatTimeAgo(activity.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed">
                              <span className="text-slate-900 font-semibold">{activity.user_name}</span>
                              {activity.details && <span className="text-slate-600"> {activity.details}</span>}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </>
              )}
            </div>

            {activities.length > activityPerPage && (
              <div className="flex bg-white/80 backdrop-blur-sm border-slate-100 border-t py-4 px-6 items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Showing</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                    {(activityPage - 1) * activityPerPage + 1}-{Math.min(activityPage * activityPerPage, activities.length)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">of</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                    {activities.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActivityPage(Math.max(1, activityPage - 1))}
                    disabled={activityPage === 1}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 transition-all"
                  >
                    <Icon icon="solar:alt-arrow-left-linear" width="16" />
                  </button>
                  <button
                    onClick={() => setActivityPage(Math.min(Math.ceil(activities.length / activityPerPage), activityPage + 1))}
                    disabled={activityPage >= Math.ceil(activities.length / activityPerPage)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 transition-all"
                  >
                    <Icon icon="solar:alt-arrow-right-linear" width="16" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSettings && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center">
                  <Icon icon="solar:settings-linear" width="18" className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Workspace Settings</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage your workspace information</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Icon icon="solar:close-circle-linear" width="20" className="text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Company Logo
                </label>
                <p className="text-xs text-slate-500 mb-3">Upload a square logo (max 5MB). PNG, JPG, or SVG format.</p>

                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-xl bg-white border border-slate-200 ring-1 ring-slate-100 overflow-hidden flex items-center justify-center p-3 shadow-sm">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <Icon icon="solar:gallery-linear" width="24" className="text-slate-400" />
                      )}
                    </div>
                    {uploadingLogo && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      <Icon icon="solar:upload-linear" width="16" />
                      Upload Logo
                    </label>
                    {logoPreview && (
                      <button
                        onClick={handleRemoveLogo}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-all ml-2"
                      >
                        <Icon icon="solar:trash-bin-trash-linear" width="16" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={editingWorkspace.name || ''}
                    onChange={(e) => setEditingWorkspace({ ...editingWorkspace, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email</label>
                  <input
                    type="email"
                    value={editingWorkspace.email || ''}
                    onChange={(e) => setEditingWorkspace({ ...editingWorkspace, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm"
                    placeholder="hello@company.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editingWorkspace.phone || ''}
                    onChange={(e) => setEditingWorkspace({ ...editingWorkspace, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Website</label>
                  <input
                    type="text"
                    value={editingWorkspace.website || ''}
                    onChange={(e) => setEditingWorkspace({ ...editingWorkspace, website: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm"
                    placeholder="www.example.com"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Address</label>
                  <textarea
                    value={editingWorkspace.address || ''}
                    onChange={(e) => setEditingWorkspace({ ...editingWorkspace, address: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm resize-none"
                    rows={2}
                    placeholder="123 Business Street, City, Country"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Company Profile</label>
                  <textarea
                    value={editingWorkspace.profile || ''}
                    onChange={(e) => setEditingWorkspace({ ...editingWorkspace, profile: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm resize-none"
                    rows={4}
                    placeholder="Tell us about your company, what you do, and what makes you unique..."
                  />
                  <p className="text-xs text-slate-500 mt-1.5">
                    A brief description that helps others understand your business
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Display Preferences
                </label>
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon icon="solar:chart-bold" width="16" className="text-slate-600" />
                      <span className="text-sm font-semibold text-slate-900">Sales Leaderboard</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Show or hide the sales leaderboard section in your workspace
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingWorkspace({ ...editingWorkspace, show_leaderboard: !editingWorkspace.show_leaderboard })}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 ${
                      editingWorkspace.show_leaderboard ? 'bg-slate-900' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        editingWorkspace.show_leaderboard ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {isOwner && (
                <div className="pt-6 mt-6 border-t border-slate-200">
                  <div className="bg-gradient-to-br from-rose-50 to-red-50/30 border border-rose-200/60 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl"></div>
                    <div className="relative">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                            <Icon icon="solar:danger-bold" width="24" className="text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-slate-900 mb-1 tracking-tight">Danger Zone</h3>
                          <p className="text-xs text-slate-600 leading-relaxed mb-4">
                            Once you delete this workspace, all data including members, invoices, and documents will be permanently removed. This action cannot be undone.
                          </p>
                          <button
                            onClick={() => setShowDeleteWorkspaceConfirm(true)}
                            className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-rose-600 border-2 border-rose-200 hover:border-rose-600 text-rose-600 hover:text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-rose-500/20 active:scale-95"
                          >
                            <Icon icon="solar:trash-bin-minimalistic-bold" width="16" className="group-hover:rotate-12 transition-transform" />
                            <span>Delete Workspace</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-6 border-t border-slate-100 bg-slate-50">
              <p className="text-xs text-slate-500">Changes will be saved to your workspace</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showAddMember && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Icon icon="solar:user-plus-bold" width="32" className="text-emerald-600" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Invite Team Member</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Add someone to your workspace</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddMember(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Icon icon="solar:close-circle-linear" width="20" className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Share Invite Link</label>
                  <button
                    onClick={copyInviteLink}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-300 text-slate-700 rounded-lg text-[11px] font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all"
                  >
                    <Icon icon="solar:copy-linear" width="12" />
                    Copy
                  </button>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs text-slate-600 truncate">
                  {inviteLink}
                </div>
                <p className="text-[11px] text-slate-500 mt-2">Anyone with this link can join as a member</p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-slate-500 font-medium">or send direct invite</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  value={newMember.user_email}
                  onChange={(e) => setNewMember({ ...newMember, user_email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm"
                  placeholder="colleague@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Role</label>
                <Dropdown
                  value={newMember.role}
                  options={[
                    { value: 'member', label: 'Member' },
                    { value: 'admin', label: 'Admin' },
                  ]}
                  onChange={(val) => setNewMember({ ...newMember, role: val as 'owner' | 'admin' | 'member' })}
                  icon="solar:shield-user-linear"
                  className="w-full"
                  buttonClassName="w-full"
                  menuClassName="w-full"
                  menuAlign="left"
                />
                <p className="text-xs text-slate-500 mt-1.5">Defines what this person can access and manage</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setShowAddMember(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showLeaveConfirm && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <Icon icon="solar:logout-2-bold" width="24" className="text-rose-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-slate-900 mb-1">Leave Workspace</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Are you sure you want to leave <span className="font-semibold text-slate-900">{currentWorkspace.name}</span>? You'll lose access to all workspace data and will need to be re-invited to rejoin.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLeaveWorkspace}
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition-all shadow-sm"
                >
                  Leave Workspace
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showJoinWorkspace && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Icon icon="solar:add-circle-bold" width="32" className="text-sky-600" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Join Workspace</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Enter an invite code or link</p>
                </div>
              </div>
              <button
                onClick={() => setShowJoinWorkspace(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Icon icon="solar:close-circle-linear" width="20" className="text-slate-400" />
              </button>
            </div>

            <div className="p-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Workspace Code or Link</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm"
                  placeholder="Paste invite link or enter code"
                />
                <p className="text-xs text-slate-500 mt-2">Get an invite link from a workspace member to join</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setShowJoinWorkspace(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinWorkspace}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm"
              >
                Join Workspace
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showRoleUpdateConfirm && pendingRoleUpdate && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Icon icon="solar:user-check-rounded-bold" width="24" className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-slate-900 mb-1">Update Member Role</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Are you sure you want to change <span className="font-semibold text-slate-900">{pendingRoleUpdate.memberName}</span>'s role to <span className="font-semibold text-slate-900">{pendingRoleUpdate.newRole}</span>?
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowRoleUpdateConfirm(false);
                    setPendingRoleUpdate(null);
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRoleUpdate}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm"
                >
                  Update Role
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showRemoveMemberConfirm && pendingMemberRemoval && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <Icon icon="solar:user-minus-rounded-bold" width="24" className="text-rose-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-slate-900 mb-1">Remove Team Member</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Are you sure you want to remove <span className="font-semibold text-slate-900">{pendingMemberRemoval.memberName}</span> from this workspace? They will lose access immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowRemoveMemberConfirm(false);
                    setPendingMemberRemoval(null);
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveMember}
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition-all shadow-sm"
                >
                  Remove Member
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showDeleteWorkspaceConfirm && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-500/30">
                  <Icon icon="solar:danger-triangle-bold" width="28" className="text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-slate-900 mb-1">Delete Workspace</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Are you absolutely sure you want to delete <span className="font-bold text-slate-900">{currentWorkspace.name}</span>?
                  </p>
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Icon icon="solar:info-circle-bold" width="18" className="text-rose-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-rose-900 font-semibold mb-1">This action is permanent and irreversible</p>
                    <ul className="text-xs text-rose-800 space-y-1 list-disc list-inside">
                      <li>All workspace data will be permanently deleted</li>
                      <li>All members will lose access immediately</li>
                      <li>Invoices, quotations, and documents will be lost</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDeleteWorkspaceConfirm(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteWorkspace}
                  className="px-4 py-2.5 bg-gradient-to-br from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 active:scale-95"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showCreateWorkspace && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Icon icon="solar:add-square-bold" width="32" className="text-slate-700" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Create New Workspace</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Set up your new workspace</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateWorkspace(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Icon icon="solar:close-circle-linear" width="20" className="text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Company Logo
                </label>
                <p className="text-xs text-slate-500 mb-3">Upload a square logo (max 5MB). PNG, JPG, or SVG format.</p>

                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-xl bg-white border border-slate-200 ring-1 ring-slate-100 overflow-hidden flex items-center justify-center p-3 shadow-sm">
                      {newWorkspaceLogoPreview ? (
                        <img
                          src={newWorkspaceLogoPreview}
                          alt="Logo preview"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <Icon icon="solar:gallery-linear" width="24" className="text-slate-400" />
                      )}
                    </div>
                    {uploadingNewWorkspaceLogo && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      ref={newWorkspaceFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleNewWorkspaceLogoUpload}
                      className="hidden"
                      id="new-workspace-logo-upload"
                    />
                    <label
                      htmlFor="new-workspace-logo-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      <Icon icon="solar:upload-linear" width="16" />
                      Upload Logo
                    </label>
                    {newWorkspaceLogoPreview && (
                      <button
                        onClick={handleRemoveNewWorkspaceLogo}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-all ml-2"
                      >
                        <Icon icon="solar:trash-bin-trash-linear" width="16" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={newWorkspace.name}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email</label>
                  <input
                    type="email"
                    value={newWorkspace.email}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm"
                    placeholder="hello@company.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Phone</label>
                  <input
                    type="tel"
                    value={newWorkspace.phone}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Website</label>
                  <input
                    type="text"
                    value={newWorkspace.website}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, website: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm"
                    placeholder="www.example.com"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Address</label>
                  <textarea
                    value={newWorkspace.address}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, address: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm resize-none"
                    rows={2}
                    placeholder="123 Business Street, City, Country"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Company Profile</label>
                  <textarea
                    value={newWorkspace.profile}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, profile: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm resize-none"
                    rows={4}
                    placeholder="Tell us about your company, what you do, and what makes you unique..."
                  />
                  <p className="text-xs text-slate-500 mt-1.5">
                    A brief description that helps others understand your business
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-slate-100 bg-slate-50">
              <p className="text-xs text-slate-500">You will be set as the workspace owner</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCreateWorkspace(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateWorkspace}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm"
                >
                  Create Workspace
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
