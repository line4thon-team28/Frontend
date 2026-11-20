import bellIcon from '../assets/icons/bell.svg'
import homeIcon from '../assets/icons/home.svg'
import pawIcon from '../assets/icons/paw.svg'
import userIcon from '../assets/icons/user.svg'

export const MAIN_TABS = [
  { to: '/home', label: '홈', icon: homeIcon },
  { to: '/candidates', label: '후보', icon: pawIcon },
  { to: '/notifications', label: '알림', icon: bellIcon },
  { to: '/my', label: '내 등록', icon: userIcon },
]
