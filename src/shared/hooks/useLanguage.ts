import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLanguage, type Language } from '@/store/settingsSlice';
import { strings } from '@/constants/strings';

export const useLanguage = () => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector((state) => state.settings.language);

  const t = strings[lang];

  const changeLanguage = (newLang: Language) => {
    dispatch(setLanguage(newLang));
  };

  return {
    lang,
    t,
    changeLanguage,
  };
};
