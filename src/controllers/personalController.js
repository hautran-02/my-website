import { NAV_BARS } from '~/constants/blog';

const personalController = {};

personalController.viewabout = (req, res, next) => {
  const contactInfors = [
    {
      key: 'address',
      icon: 'bx bxs-home',
      value: 'Ho Chi Minh',
      disable: true,
    },
    {
      key: 'gmail',
      icon: 'bx bxs-envelope',
      value: 'hautrantrung.02@gmail.com',
      disable: true,
    },
    {
      key: 'github',
      icon: 'bx bxl-github',
      value: 'https://github.com/hautrank2',
      label: 'hautrank2',
    },
    {
      key: 'facebook',
      icon: 'bx bxl-facebook-square',
      value: 'https://www.facebook.com/hautrank2/',
      label: 'hautrank2',
    },
    {
      key: 'youtube',
      icon: 'bx bxl-youtube',
      value: 'https://www.youtube.com/@hautran2596',
      label: 'hautran2596',
    },
    {
      key: 'instagram',
      icon: 'bx bxl-instagram-alt',
      value: 'https://www.instagram.com/hautrank2/',
      label: 'hautrank2',
    },
    {
      key: 'pinterest',
      icon: 'bx bxl-pinterest',
      value: 'https://za.pinterest.com/hautrank2/',
      label: 'hautrank2',
    },
    {
      key: 'tiktok',
      icon: 'bx bxl-tiktok',
      value: 'https://www.tiktok.com/@hautrank2',
      label: 'hautrank2',
    },
  ];
  res.render('about', { page: 'about', navbars: NAV_BARS, contactInfors });
};

export default personalController;
