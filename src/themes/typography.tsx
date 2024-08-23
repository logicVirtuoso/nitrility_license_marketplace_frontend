// ==============================|| DEFAULT THEME - TYPOGRAPHY  ||============================== //

const MyTypography = () => ({
  htmlFontSize: 16,
  fontFamily: 'var(--font-base)',
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
  h1: {
    fontFamily: 'var(--font-semi-bold)',
    fontSize: '48px',
    lineHeight: '56px',
  },
  h2: {
    fontFamily: 'var(--font-semi-bold)',
    fontSize: '32px',
    lineHeight: '40px',
  },
  h3: {
    fontFamily: 'var(--font-semi-bold)',
    fontSize: '24px',
    lineHeight: '32px',
  },
  h4: {
    fontFamily: 'var(--font-medium)',
    fontSize: '18px',
    lineHeight: '26px',
  },
  h5: {
    fontFamily: 'var(--font-medium)',
    fontSize: '16px',
    lineHeight: '22px',
  },
  h6: {
    fontFamily: 'var(--font-mono-regular)',
    fontSize: '16px',
    lineHeight: '20px',
  },
  body1: {
    fontSize: '16px',
    lineHeight: '24px',
  },
  body2: {
    fontSize: '14px',
    lineHeight: '20px',
  },
  caption: {
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '20px',
  },
  subtitle1: {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 400,
  },
  subtitle2: {
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '16px',
  },
  overline: {
    lineHeight: 1.66,
  },
})

export default MyTypography
