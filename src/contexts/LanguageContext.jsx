import { createContext, useContext, useEffect, useState } from 'react'

// สร้าง Context สำหรับแชร์ภาษาให้ทุกหน้าในเว็บไซต์
const LanguageContext = createContext(null)

// คลังข้อความภาษาอังกฤษและภาษาไทย
const translations = {
  en: {
    // [เพิ่ม] ข้อความสำหรับหน้า Login และ Register
    signIn: 'Sign in',
    signInSubtitle: 'Sign in to continue exploring repositories.',
    email: 'Email',
    enterEmail: 'Enter your email',
    password: 'Password',
    enterPassword: 'Enter your password',
    signingIn: 'Signing in...',
    dontHaveAccount: "Don't have an account?",
    createAccount: 'Create account',
    joinGitScopeSubtitle: 'Join GitScope and discover open source projects.',
    passwordMinLength: 'At least 6 characters',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm your password',
    creatingAccount: 'Creating account...',
    alreadyHaveAccount: 'Already have an account?',

    // เมนูและระบบบัญชี
    dashboard: 'Dashboard',
    explore: 'Explore',
    collections: 'Collections',
    logout: 'Logout',
    loggingOut: 'Logging out...',
    menu: 'Menu',
    authChecking: 'Checking authentication...',

    // Dashboard: การ์ดสถิติ
    repositoriesFound: 'Repositories found',
    matchingGitHubSearch: 'Matching GitHub search',
    totalRepositoryStars: 'Total Repository Stars',
    acrossLoadedRepositories: 'Across loaded repositories',
    languages: 'Languages',
    languagesIdentified: 'Languages identified',
    totalForks: 'Total Forks',

    // Dashboard: ส่วนต้อนรับ
    discoverOpenSource: 'Discover open source.',
    welcomeDescription:
      'Explore repositories and discover interesting projects from the developer community.',

    // Dashboard: สถานะโหลดข้อมูล
    loadingGitHubStatistics: 'Loading GitHub statistics...',
    unableToLoadDashboard: 'Unable to load dashboard',
    tryAgain: 'Try again',

    // Dashboard: ภาพรวม
    repositoryInsights: 'Repository insights',
    analyticsDescription: 'Analytics from loaded GitHub repositories',
    top30Results: 'Top 30 results',

    // Dashboard: กราฟวงกลม
    languageDistribution: 'Language distribution',
    programmingLanguagesInRepositories: 'Programming languages in repositories',
    mostCommonLanguage: 'Most common language',
    noLanguageData: 'No language data available',

    // Dashboard: Repository ยอดนิยม
    popularRepositories: 'Popular repositories',
    mostStarredProjects: 'Most starred projects',
    noRepositoriesAvailable: 'No repositories available',

    // Dashboard: กราฟเปรียบเทียบ
    starsForksComparison: 'Stars & Forks comparison',
    compareEngagement: 'Compare engagement across popular repositories',
    noChartData: 'No chart data available',
    stars: 'Stars',
    forks: 'Forks',

    // Dashboard: ส่วน Explore
    startExploring: 'Start exploring',
    findFavoriteProject: 'Find your next favorite project.',
    exploreRepositories: 'Explore repositories',

    // คำทั่วไป
    other: 'Other',

    // Explore
    exploreRepositoriesTitle: 'Explore repositories',
    exploreDescription:
      'Find interesting projects from developers around the world.',
    searchPlaceholder: 'Search React, Python, machine learning...',
    search: 'Search',
    searching: 'Searching...',
    languageFilter: 'Language',
    allLanguages: 'All languages',
    sortBy: 'Sort by',
    mostStars: 'Most stars',
    mostForks: 'Most forks',
    recentlyUpdated: 'Recently updated',
    searchingGitHubRepositories: 'Searching GitHub repositories...',
    enterSearchKeyword: 'Please enter a repository name or keyword.',
    searchFailed: 'Unable to search repositories.',
    noRepositoriesFound: 'No repositories found',
    tryAnotherKeyword: 'Try another keyword or language.',
    addToFavorites: 'Add to favorites',
    removeFromFavorites: 'Remove from favorites',
    favoriteUpdateError: 'Unable to update favorite.',
    noDescription: 'No description provided.',
    enterKeywordToExplore:
      'Enter a keyword above to explore GitHub repositories.',

    // Repository Details
    githubRepository: 'GITHUB REPOSITORY',
    backToExplore: 'Back to Explore',
    loadingRepositoryDetails: 'Loading repository details...',
    somethingWentWrong: 'Something went wrong',
    repositoryNotFound: 'Repository not found.',
    unableToLoadRepository: 'Unable to load repository details.',
    viewOnGitHub: 'View on GitHub',
    watchers: 'Watchers',
    openIssues: 'Open Issues',
    languageInformationUnavailable:
      'Language information is not available.',
    repositoryInformation: 'Repository Information',
    primaryLanguage: 'Primary language',
    created: 'Created',
    lastUpdated: 'Last updated',
    defaultBranch: 'Default branch',
    license: 'License',
    notSpecified: 'Not specified',
    notAvailable: 'Not available',

    // Collections
    yourPersonalCollection: 'YOUR PERSONAL COLLECTION',
    myCollections: 'My Collections',
    collectionsDescription:
      'Keep track of your favorite open-source projects.',
    savedRepositories: 'Saved repositories',
    searchCollectionsPlaceholder: 'Search your collections...',
    loadingCollections: 'Loading your collections...',
    emptyCollection: 'Your collection is empty',
    emptyCollectionDescription:
      'Explore repositories and bookmark projects you like.',
    noCollectionResults: 'No repositories found',
    tryAnotherCollectionSearch: 'Try another search keyword.',
    savedRepository: 'Saved repository',
    removeFromCollections: 'Remove from collections',
    collectionsLoadFailed: 'Failed to load collections.',
    collectionsRemoveFailed: 'Failed to remove repository.',
    collectionsNoDescription: 'No description provided.',
    otherLanguage: 'Other',
    
  },

  th: {
    // [เพิ่ม] ข้อความสำหรับหน้า Login และ Register (ภาษาไทย)
    signIn: 'เข้าสู่ระบบ',
    signInSubtitle: 'เข้าสู่ระบบเพื่อสำรวจ Repository ต่อ',
    email: 'อีเมล',
    enterEmail: 'กรอกอีเมลของคุณ',
    password: 'รหัสผ่าน',
    enterPassword: 'กรอกรหัสผ่านของคุณ',
    signingIn: 'กำลังเข้าสู่ระบบ...',
    dontHaveAccount: 'ยังไม่มีบัญชีใช่ไหม?',
    createAccount: 'สร้างบัญชีใหม่',
    joinGitScopeSubtitle: 'เข้าร่วม GitScope และค้นพบโปรเจกต์ Open Source',
    passwordMinLength: 'อย่างน้อย 6 ตัวอักษร',
    confirmPassword: 'ยืนยันรหัสผ่าน',
    confirmPasswordPlaceholder: 'กรอกรหัสผ่านอีกครั้ง',
    creatingAccount: 'กำลังสร้างบัญชี...',
    alreadyHaveAccount: 'มีบัญชีอยู่แล้ว?',

    // เมนูและระบบบัญชี
    dashboard: 'ภาพรวม',
    explore: 'สำรวจ',
    collections: 'คอลเลกชัน',
    logout: 'ออกจากระบบ',
    loggingOut: 'กำลังออกจากระบบ...',
    menu: 'เมนู',
    authChecking: 'กำลังตรวจสอบการเข้าสู่ระบบ...',

    // Dashboard: การ์ดสถิติ
    repositoriesFound: 'จำนวน Repository ที่พบ',
    matchingGitHubSearch: 'จำนวนผลลัพธ์ที่ตรงกับการค้นหา GitHub',
    totalRepositoryStars: 'ดาวรวมของ Repository',
    acrossLoadedRepositories: 'รวมจาก Repository ที่โหลดมา',
    languages: 'ภาษาโปรแกรม',
    languagesIdentified: 'จำนวนภาษาที่พบ',
    totalForks: 'จำนวน Forks ทั้งหมด',

    // Dashboard: ส่วนต้อนรับ
    discoverOpenSource: 'ค้นพบโลกของ Open Source',
    welcomeDescription:
      'สำรวจ Repository และค้นพบโปรเจกต์ที่น่าสนใจจากชุมชนนักพัฒนา',

    // Dashboard: สถานะโหลดข้อมูล
    loadingGitHubStatistics: 'กำลังโหลดสถิติจาก GitHub...',
    unableToLoadDashboard: 'ไม่สามารถโหลด Dashboard ได้',
    tryAgain: 'ลองอีกครั้ง',

    // Dashboard: ภาพรวม
    repositoryInsights: 'ภาพรวม Repository',
    analyticsDescription:
      'การวิเคราะห์ข้อมูลจาก Repository ที่โหลดมาจาก GitHub',
    top30Results: '30 อันดับแรก',

    // Dashboard: กราฟวงกลม
    languageDistribution: 'สัดส่วนภาษาโปรแกรม',
    programmingLanguagesInRepositories: 'ภาษาโปรแกรมที่ใช้ใน Repository',
    mostCommonLanguage: 'ภาษาที่พบมากที่สุด',
    noLanguageData: 'ไม่มีข้อมูลภาษาโปรแกรม',

    // Dashboard: Repository ยอดนิยม
    popularRepositories: 'Repository ยอดนิยม',
    mostStarredProjects: 'โปรเจกต์ที่ได้รับดาวมากที่สุด',
    noRepositoriesAvailable: 'ไม่มี Repository ให้แสดง',

    // Dashboard: กราฟเปรียบเทียบ
    starsForksComparison: 'เปรียบเทียบ Stars และ Forks',
    compareEngagement: 'เปรียบเทียบความนิยมของ Repository ยอดนิยม',
    noChartData: 'ไม่มีข้อมูลกราฟ',
    stars: 'stars',
    forks: 'Forks',

    // Dashboard: ส่วน Explore
    startExploring: 'เริ่มต้นสำรวจ',
    findFavoriteProject: 'ค้นหาโปรเจกต์ที่คุณชื่นชอบ',
    exploreRepositories: 'สำรวจ Repository',

    // คำทั่วไป
    other: 'อื่น ๆ',

    // Explore
    exploreRepositoriesTitle: 'สำรวจ Repository',
    exploreDescription: 'ค้นพบโปรเจกต์ที่น่าสนใจจากนักพัฒนาทั่วโลก',
    searchPlaceholder: 'ค้นหา React, Python, Machine Learning...',
    search: 'ค้นหา',
    searching: 'กำลังค้นหา...',
    languageFilter: 'ภาษาโปรแกรม',
    allLanguages: 'ทุกภาษา',
    sortBy: 'เรียงตาม',
    mostStars: 'จำนวน Stars มากที่สุด',
    mostForks: 'จำนวน Forks มากที่สุด',
    recentlyUpdated: 'อัปเดตล่าสุด',
    searchingGitHubRepositories: 'กำลังค้นหา Repository บน GitHub...',
    enterSearchKeyword: 'กรุณากรอกชื่อ Repository หรือคำค้นหา',
    searchFailed: 'ไม่สามารถค้นหา Repository ได้',
    noRepositoriesFound: 'ไม่พบ Repository',
    tryAnotherKeyword: 'ลองใช้คำค้นหาหรือภาษาอื่น',
    addToFavorites: 'เพิ่มในรายการโปรด',
    removeFromFavorites: 'นำออกจากรายการโปรด',
    favoriteUpdateError: 'ไม่สามารถอัปเดตรายการโปรดได้',
    noDescription: 'ไม่มีคำอธิบาย',
    enterKeywordToExplore:
      'กรอกคำค้นหาด้านบนเพื่อสำรวจ Repository บน GitHub',

    // Repository Details
    githubRepository: 'GITHUB REPOSITORY',
    backToExplore: 'กลับไปหน้าสำรวจ',
    loadingRepositoryDetails: 'กำลังโหลดรายละเอียด Repository...',
    somethingWentWrong: 'เกิดข้อผิดพลาด',
    repositoryNotFound: 'ไม่พบ Repository นี้',
    unableToLoadRepository: 'ไม่สามารถโหลดรายละเอียด Repository ได้',
    viewOnGitHub: 'ดูบน GitHub',
    watchers: 'ผู้ติดตาม',
    openIssues: 'Issues ที่ยังเปิดอยู่',
    languageInformationUnavailable: 'ไม่มีข้อมูลภาษาโปรแกรม',
    repositoryInformation: 'ข้อมูล Repository',
    primaryLanguage: 'ภาษาหลัก',
    created: 'วันที่สร้าง',
    lastUpdated: 'อัปเดตล่าสุด',
    defaultBranch: 'Branch เริ่มต้น',
    license: 'สัญญาอนุญาต',
    notSpecified: 'ไม่ได้ระบุ',
    notAvailable: 'ไม่มีข้อมูล',

    // Collections
    yourPersonalCollection: 'คอลเลกชันส่วนตัวของคุณ',
    myCollections: 'คอลเลกชันของฉัน',
    collectionsDescription:
      'จัดเก็บและติดตามโปรเจกต์ Open Source ที่คุณชื่นชอบ',
    savedRepositories: 'Repository ที่บันทึกไว้',
    searchCollectionsPlaceholder: 'ค้นหาในคอลเลกชันของคุณ...',
    loadingCollections: 'กำลังโหลดคอลเลกชัน...',
    emptyCollection: 'ยังไม่มี Repository ที่บันทึกไว้',
    emptyCollectionDescription:
      'ไปที่หน้าสำรวจเพื่อค้นหาและบันทึกโปรเจกต์ที่คุณชื่นชอบ',
    noCollectionResults: 'ไม่พบ Repository',
    tryAnotherCollectionSearch: 'ลองใช้คำค้นหาอื่น',
    savedRepository: 'Repository ที่บันทึกไว้',
    removeFromCollections: 'นำออกจากคอลเลกชัน',
    collectionsLoadFailed: 'ไม่สามารถโหลดคอลเลกชันได้',
    collectionsRemoveFailed: 'ไม่สามารถลบ Repository ได้',
    collectionsNoDescription: 'ไม่มีคำอธิบาย',
    otherLanguage: 'ภาษาอื่น',
  },
}

// Provider สำหรับจัดการและแชร์ภาษาที่เลือก
export function LanguageProvider({ children }) {
  // อ่านภาษาที่เคยเลือกไว้จาก Local Storage
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('gitscope-language')

    return savedLanguage === 'th' || savedLanguage === 'en'
      ? savedLanguage
      : 'en'
  })

  // บันทึกภาษาที่เลือกไว้
  useEffect(() => {
    localStorage.setItem('gitscope-language', language)
  }, [language])

  // สลับภาษาไทยและภาษาอังกฤษ
  function toggleLanguage() {
    setLanguage((currentLanguage) =>
      currentLanguage === 'en' ? 'th' : 'en'
    )
  }

  // ดึงข้อความตามภาษาปัจจุบัน
  function t(key) {
    return translations[language]?.[key] ?? key
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

// Hook สำหรับเรียกใช้ระบบภาษาในแต่ละหน้า
export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }

  return context
}