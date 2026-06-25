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
  schedule: {
    title: string;
    subtitle: string;
    addEvent: string;
    editEvent: string;
    eventDetails: string;
    deleteEvent: string;
    deleteConfirm: string;
    filter: string;
    today: string;
    form: {
      titleLabel: string;
      titlePlaceholder: string;
      descriptionLabel: string;
      descriptionPlaceholder: string;
      contextLabel: string;
      startDateLabel: string;
      endDateLabel: string;
      isRecurringLabel: string;
      recurringDaysLabel: string;
      recurringEndDateLabel: string;
    };
    validation: {
      titleRequired: string;
      startDateRequired: string;
      endDateRequired: string;
      contextRequired: string;
      dateOrderInvalid: string;
    };
    conflictWarningTitle: string;
    conflictWarningDesc: string;
    views: {
      month: string;
      week: string;
      day: string;
    };
    dayView: {
      eventsCountLabel: string;
      noEvents: string;
      emptyStateActionDesc: string;
      recurring: string;
      conflictMessage: string;
    };
    monthView: {
      weekDays: string[];
    };
    weekView: {
      noEvents: string;
      conflictBadge: string;
    };
    prevAriaLabel: string;
    nextAriaLabel: string;
  };
  finance: {
    title: string;
    subtitle: string;
    totalIncome: string;
    totalExpense: string;
    netBalance: string;
    addTransaction: string;
    editTransaction: string;
    deleteTransaction: string;
    deleteConfirm: string;
    setBudget: string;
    budgetAlert: string;
    budgetLimit: string;
    budgetStatus: string;
    incomeTrend: string;
    expenseBreakdown: string;
    categories: {
      salary: string;
      business: string;
      freelance: string;
      food: string;
      transportation: string;
      subscription: string;
      education: string;
      entertainment: string;
      others: string;
    };
    form: {
      titleLabel: string;
      titlePlaceholder: string;
      typeLabel: string;
      amountLabel: string;
      amountPlaceholder: string;
      categoryLabel: string;
      dateLabel: string;
      descriptionLabel: string;
      descriptionPlaceholder: string;
    };
    validation: {
      titleRequired: string;
      amountRequired: string;
      categoryRequired: string;
      dateRequired: string;
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
    },
    schedule: {
      title: 'Jadwal Terpadu',
      subtitle: 'Pantau dan kelola jadwal aktivitas Anda dari semua kategori secara terintegrasi.',
      addEvent: 'Tambah Jadwal Baru',
      editEvent: 'Ubah Jadwal',
      eventDetails: 'Detail Jadwal',
      deleteEvent: 'Hapus Jadwal',
      deleteConfirm: 'Apakah Anda yakin ingin menghapus jadwal ini?',
      filter: 'Filter',
      today: 'Hari Ini',
      form: {
        titleLabel: 'Nama Kegiatan',
        titlePlaceholder: 'Contoh: Kuliah Aljabar Linear',
        descriptionLabel: 'Keterangan',
        descriptionPlaceholder: 'Tambahkan deskripsi atau tautan pertemuan',
        contextLabel: 'Kategori / Konteks',
        startDateLabel: 'Waktu Mulai',
        endDateLabel: 'Waktu Selesai',
        isRecurringLabel: 'Ulangi Kegiatan Ini',
        recurringDaysLabel: 'Ulangi Pada Hari',
        recurringEndDateLabel: 'Selesai Pengulangan Pada',
      },
      validation: {
        titleRequired: 'Nama kegiatan wajib diisi.',
        startDateRequired: 'Waktu mulai wajib diisi.',
        endDateRequired: 'Waktu selesai wajib diisi.',
        contextRequired: 'Kategori wajib dipilih.',
        dateOrderInvalid: 'Waktu selesai harus setelah waktu mulai.',
      },
      conflictWarningTitle: 'Bentrokan Jadwal Terdeteksi!',
      conflictWarningDesc: 'Beberapa kegiatan Anda bertabrakan di tampilan ini.',
      views: {
        month: 'Bulanan',
        week: 'Mingguan',
        day: 'Harian',
      },
      dayView: {
        eventsCountLabel: '{count} Kegiatan',
        noEvents: 'Tidak ada kegiatan untuk hari ini',
        emptyStateActionDesc: 'Klik sel kosong atau tombol Tambah Jadwal untuk membuat kegiatan baru',
        recurring: 'Berulang',
        conflictMessage: 'Bentrokan jadwal: Kegiatan ini bertabrakan dengan kegiatan lain!',
      },
      monthView: {
        weekDays: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
      },
      weekView: {
        noEvents: 'Tidak ada kegiatan',
        conflictBadge: 'Bentrokan',
      },
      prevAriaLabel: 'Sebelumnya',
      nextAriaLabel: 'Berikutnya',
    },
    finance: {
      title: 'Pelacak Keuangan',
      subtitle: 'Kelola pemasukan, pengeluaran, anggaran, dan pantau kesehatan finansial Anda.',
      totalIncome: 'Total Pemasukan',
      totalExpense: 'Total Pengeluaran',
      netBalance: 'Saldo Bersih',
      addTransaction: 'Tambah Transaksi',
      editTransaction: 'Ubah Transaksi',
      deleteTransaction: 'Hapus Transaksi',
      deleteConfirm: 'Apakah Anda yakin ingin menghapus transaksi ini?',
      setBudget: 'Atur Anggaran',
      budgetAlert: 'Peringatan Anggaran!',
      budgetLimit: 'Batas Anggaran',
      budgetStatus: 'Status Anggaran',
      incomeTrend: 'Tren Pemasukan vs Pengeluaran (6 Bulan Terakhir)',
      expenseBreakdown: 'Rincian Pengeluaran per Kategori',
      categories: {
        salary: 'Gaji',
        business: 'Usaha',
        freelance: 'Lepas (Freelance)',
        food: 'Makanan & Minuman',
        transportation: 'Transportasi',
        subscription: 'Langganan',
        education: 'Pendidikan',
        entertainment: 'Hiburan',
        others: 'Lainnya',
      },
      form: {
        titleLabel: 'Nama Transaksi',
        titlePlaceholder: 'misal: Gaji Bulanan, Makan Siang',
        typeLabel: 'Tipe Transaksi',
        amountLabel: 'Jumlah (Rp)',
        amountPlaceholder: '0',
        categoryLabel: 'Kategori',
        dateLabel: 'Tanggal',
        descriptionLabel: 'Keterangan',
        descriptionPlaceholder: 'Catatan opsional',
      },
      validation: {
        titleRequired: 'Nama transaksi wajib diisi.',
        amountRequired: 'Jumlah transaksi harus lebih dari 0.',
        categoryRequired: 'Kategori wajib dipilih.',
        dateRequired: 'Tanggal wajib diisi.',
      },
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
      todo: 'Smart To-Do',
      schedule: 'Unified Schedule',
      finance: 'Finance Tracker',
      notes: 'Quick Notes',
      habits: 'Habit & Gym Log',
      focus: 'Focus Mode',
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
    },
    schedule: {
      title: 'Unified Schedule',
      subtitle: 'Monitor and manage your schedules across all categories in an integrated view.',
      addEvent: 'Add New Event',
      editEvent: 'Edit Event',
      eventDetails: 'Event Details',
      deleteEvent: 'Delete Event',
      deleteConfirm: 'Are you sure you want to delete this event?',
      filter: 'Filters',
      today: 'Today',
      form: {
        titleLabel: 'Event Title',
        titlePlaceholder: 'e.g., Linear Algebra Class',
        descriptionLabel: 'Description',
        descriptionPlaceholder: 'Add a description or meeting link',
        contextLabel: 'Category / Context',
        startDateLabel: 'Start Time',
        endDateLabel: 'End Time',
        isRecurringLabel: 'Repeat This Event',
        recurringDaysLabel: 'Repeat On',
        recurringEndDateLabel: 'End Recurrence On',
      },
      validation: {
        titleRequired: 'Event title is required.',
        startDateRequired: 'Start time is required.',
        endDateRequired: 'End time is required.',
        contextRequired: 'Category is required.',
        dateOrderInvalid: 'End time must be after start time.',
      },
      conflictWarningTitle: 'Schedule Conflict Detected!',
      conflictWarningDesc: 'Some of your schedules conflict in this view.',
      views: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
      },
      dayView: {
        eventsCountLabel: '{count} Event(s)',
        noEvents: 'No events scheduled for this day',
        emptyStateActionDesc: 'Click a blank cell or the Add Event button to schedule one',
        recurring: 'Recurring',
        conflictMessage: 'Schedule conflict: This event overlaps with another event!',
      },
      monthView: {
        weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      },
      weekView: {
        noEvents: 'No events scheduled',
        conflictBadge: 'Conflict',
      },
      prevAriaLabel: 'Previous',
      nextAriaLabel: 'Next',
    },
    finance: {
      title: 'Finance Tracker',
      subtitle: 'Manage income, expenses, budgets, and monitor your financial health.',
      totalIncome: 'Total Income',
      totalExpense: 'Total Expense',
      netBalance: 'Net Balance',
      addTransaction: 'Add Transaction',
      editTransaction: 'Edit Transaction',
      deleteTransaction: 'Delete Transaction',
      deleteConfirm: 'Are you sure you want to delete this transaction?',
      setBudget: 'Set Budget',
      budgetAlert: 'Budget Alert!',
      budgetLimit: 'Budget Limit',
      budgetStatus: 'Budget Status',
      incomeTrend: 'Income vs Expense Trend (Last 6 Months)',
      expenseBreakdown: 'Expense Breakdown by Category',
      categories: {
        salary: 'Salary',
        business: 'Business',
        freelance: 'Freelance',
        food: 'Food',
        transportation: 'Transportation',
        subscription: 'Subscription',
        education: 'Education',
        entertainment: 'Entertainment',
        others: 'Others',
      },
      form: {
        titleLabel: 'Transaction Title',
        titlePlaceholder: 'e.g., Monthly Salary, Lunch',
        typeLabel: 'Transaction Type',
        amountLabel: 'Amount',
        amountPlaceholder: '0',
        categoryLabel: 'Category',
        dateLabel: 'Date',
        descriptionLabel: 'Description',
        descriptionPlaceholder: 'Optional notes',
      },
      validation: {
        titleRequired: 'Transaction title is required.',
        amountRequired: 'Amount must be greater than 0.',
        categoryRequired: 'Category is required.',
        dateRequired: 'Date is required.',
      },
    }
  }
};
