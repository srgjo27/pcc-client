export interface TranslationType {
  appName: string;
  systemVersion: string;
  version: string;
  rightsReserved: string;
  auth: {
    loginTitle: string;
    loginDescription: string;
    registerTitle: string;
    registerDescription: string;
    emailLabel: string;
    emailPlaceholder: string;
    nameLabel: string;
    namePlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    forgotPasswordLink: string;
    dontHaveAccountText: string;
    registerLinkText: string;
    alreadyHaveAccountText: string;
    loginLinkText: string;
    submitButton: string;
    registerButton: string;
    validation: {
      emailInvalid: string;
      emailRequired: string;
      nameRequired: string;
      nameMin: string;
      passwordMin: string;
      passwordRequired: string;
      confirmPasswordRequired: string;
      passwordsMustMatch: string;
      termsRequired: string;
    };
    termsLabel: string;
    errorMessage: string;
    errorRegisterMessage: string;
  };
  menu: {
    dashboard: string;
    todo: string;
    schedule: string;
    finance: string;
    notes: string;
    habits: string;
    focus: string;
    comingSoon: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
  };
  todo: {
    title: string;
    subtitle: string;
    addButton: string;
    addAriaLabel: string;
    activeTasksTitle: string;
    activeTasksSubtitle: string;
    emptyStateTitle: string;
    emptyStateSubtitle: string;
    modalDescription: string;
    modalPlaceholder: string;
    cancelButton: string;
    saveButton: string;
    aside: {
      contextTitle: string;
      priorityTitle: string;
      reviewTitle: string;
      contexts: {
        college: string;
        work: string;
        business: string;
        personal: string;
      };
      priorities: {
        high: string;
        medium: string;
        low: string;
      };
      stats: {
        completed: string;
        pending: string;
        completionRate: string;
        tasksCount: string;
      };
    };
  };
}

export const strings: Record<'id' | 'en', TranslationType> = {
  id: {
    appName: 'PCC Client',
    systemVersion: '1.1.0',
    version: 'Versi',
    rightsReserved: 'Seluruh hak dilindungi.',
    auth: {
      loginTitle: 'Masuk ke Akun Anda',
      loginDescription: 'Silakan masukkan email dan kata sandi Anda untuk masuk.',
      registerTitle: 'Daftar Akun Baru',
      registerDescription: 'Silakan isi data diri Anda untuk membuat akun baru.',
      emailLabel: 'Alamat Email',
      emailPlaceholder: 'nama@domain.com',
      nameLabel: 'Nama Lengkap',
      namePlaceholder: 'John Doe',
      passwordLabel: 'Kata Sandi',
      passwordPlaceholder: '••••••••',
      confirmPasswordLabel: 'Konfirmasi Kata Sandi',
      confirmPasswordPlaceholder: '••••••••',
      forgotPasswordLink: 'Lupa Kata Sandi?',
      dontHaveAccountText: 'Belum memiliki akun?',
      registerLinkText: 'Daftar sekarang',
      alreadyHaveAccountText: 'Sudah memiliki akun?',
      loginLinkText: 'Masuk di sini',
      submitButton: 'Masuk',
      registerButton: 'Daftar',
      validation: {
        emailInvalid: 'Alamat email tidak valid.',
        emailRequired: 'Email wajib diisi.',
        nameRequired: 'Nama lengkap wajib diisi.',
        nameMin: 'Nama lengkap minimal harus 2 karakter.',
        passwordMin: 'Kata sandi minimal harus 8 karakter.',
        passwordRequired: 'Kata sandi wajib diisi.',
        confirmPasswordRequired: 'Konfirmasi kata sandi wajib diisi.',
        passwordsMustMatch: 'Kata sandi tidak cocok.',
        termsRequired: 'Anda harus menyetujui Syarat dan Ketentuan.',
      },
      termsLabel: 'Saya menyetujui Syarat dan Ketentuan',
      errorMessage: 'Login gagal. Silakan periksa kembali email atau kata sandi Anda.',
      errorRegisterMessage: 'Pendaftaran gagal. Silakan coba lagi.',
    },
    menu: {
      dashboard: 'Dashboard',
      todo: 'Lacak Tugas',
      schedule: 'Jadwal',
      finance: 'Keuangan',
      notes: 'Catatan',
      habits: 'Rutinitas',
      focus: 'Fokus',
      comingSoon: 'Segera Hadir',
    },
    dashboard: {
      title: 'Daily Overview',
      subtitle: 'Pantau ringkasan produktivitas harian Anda dan analisis perkembangan aktivitas mingguan.',
    },
    todo: {
      title: 'Smart To-Do',
      subtitle: 'Kelola dan lacak tugas harian Anda dengan mudah.',
      addButton: 'Tambah Tugas',
      addAriaLabel: 'Tambah Tugas Baru',
      activeTasksTitle: 'Daftar Tugas Aktif',
      activeTasksSubtitle: 'Daftar semua rencana tindakan yang perlu diselesaikan.',
      emptyStateTitle: 'Belum ada tugas terpilih',
      emptyStateSubtitle: 'Pilih filter kategori di samping atau buat tugas baru untuk memulai.',
      modalDescription: 'Formulir untuk menambahkan tugas baru.',
      modalPlaceholder: 'Konten form tambah tugas akan segera hadir di sini.',
      cancelButton: 'Batal',
      saveButton: 'Simpan',
      aside: {
        contextTitle: 'Konteks',
        priorityTitle: 'Prioritas',
        reviewTitle: 'Tinjauan Hari Ini',
        contexts: {
          college: 'Kuliah',
          work: 'Kerja',
          business: 'Usaha',
          personal: 'Personal',
        },
        priorities: {
          high: 'Tinggi',
          medium: 'Sedang',
          low: 'Rendah',
        },
        stats: {
          completed: 'Selesai',
          pending: 'Tertunda',
          completionRate: 'Tingkat Penyelesaian',
          tasksCount: '{completed} dari {total} tugas selesai',
        }
      }
    }
  },
  en: {
    appName: 'PCC Client',
    systemVersion: '1.1.0',
    version: 'Version',
    rightsReserved: 'All rights reserved.',
    auth: {
      loginTitle: 'Sign In to Your Account',
      loginDescription: 'Please enter your email and password to sign in.',
      registerTitle: 'Register New Account',
      registerDescription: 'Please fill in your details to create a new account.',
      emailLabel: 'Email Address',
      emailPlaceholder: 'name@domain.com',
      nameLabel: 'Full Name',
      namePlaceholder: 'John Doe',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      confirmPasswordLabel: 'Confirm Password',
      confirmPasswordPlaceholder: '••••••••',
      forgotPasswordLink: 'Forgot Password?',
      dontHaveAccountText: "Don't have an account?",
      registerLinkText: 'Register now',
      alreadyHaveAccountText: 'Already have an account?',
      loginLinkText: 'Sign in here',
      submitButton: 'Sign In',
      registerButton: 'Register',
      validation: {
        emailInvalid: 'Invalid email address.',
        emailRequired: 'Email is required.',
        nameRequired: 'Full name is required.',
        nameMin: 'Full name must be at least 2 characters.',
        passwordMin: 'Password must be at least 8 characters.',
        passwordRequired: 'Password is required.',
        confirmPasswordRequired: 'Confirm password is required.',
        passwordsMustMatch: 'Passwords do not match.',
        termsRequired: 'You must agree to the Terms and Conditions.',
      },
      termsLabel: 'I agree to the Terms and Conditions',
      errorMessage: 'Login failed. Please double-check your email or password.',
      errorRegisterMessage: 'Registration failed. Please try again.',
    },
    menu: {
      dashboard: 'Dashboard',
      todo: 'Track Tasks',
      schedule: 'Schedule',
      finance: 'Finance',
      notes: 'Notes',
      habits: 'Habits',
      focus: 'Focus',
      comingSoon: 'Coming Soon',
    },
    dashboard: {
      title: 'Daily Overview',
      subtitle: 'Monitor your daily productivity summary and analyze weekly activity progress.',
    },
    todo: {
      title: 'Smart To-Do',
      subtitle: 'Easily manage and track your daily tasks.',
      addButton: 'Add Task',
      addAriaLabel: 'Add New Task',
      activeTasksTitle: 'Active Tasks List',
      activeTasksSubtitle: 'List of all action plans that need to be completed.',
      emptyStateTitle: 'No task selected yet',
      emptyStateSubtitle: 'Select a category filter on the side or create a new task to start.',
      modalDescription: 'Form to add a new task.',
      modalPlaceholder: 'Add task form content will be here soon.',
      cancelButton: 'Cancel',
      saveButton: 'Save',
      aside: {
        contextTitle: 'Context',
        priorityTitle: 'Priority',
        reviewTitle: "Today's Review",
        contexts: {
          college: 'College',
          work: 'Work',
          business: 'Business',
          personal: 'Personal',
        },
        priorities: {
          high: 'High',
          medium: 'Medium',
          low: 'Low',
        },
        stats: {
          completed: 'Completed',
          pending: 'Pending',
          completionRate: 'Completion Rate',
          tasksCount: '{completed} of {total} tasks completed',
        }
      }
    }
  }
};
