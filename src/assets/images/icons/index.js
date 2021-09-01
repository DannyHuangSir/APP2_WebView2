const Icon = ({ className, size, children }) => (
  <svg
    className={className}
    width={size ? `${size}px` : '1em'}
    height={size ? `${size}px` : '1em'}
    viewBox="0 0 24 24"
    fill="none"
    fillRule="evenodd"
    clipRule="evenodd"
  >
    {children}
  </svg>
);

/* =========================================
 * ============ Favorite Icons =============
 * ====================================== */

export const ShareIcon = ({ props }) => (
  <Icon {...props}>
    <path d="M18.5 16.6531C17.6688 16.6531 16.9017 16.9592 16.3008 17.4704L10.2575 12.8816C10.3587 12.2987 10.3587 11.7013 10.2575 11.1184L16.3008 6.52959C16.9017 7.04082 17.6688 7.34694 18.5 7.34694C20.4308 7.34694 22 5.7 22 3.67347C22 1.64694 20.4308 0 18.5 0C16.5692 0 15 1.64694 15 3.67347C15 4.02857 15.0467 4.36837 15.1371 4.69286L9.39708 9.0551C8.54542 7.87041 7.19208 7.10204 5.66667 7.10204C3.08833 7.10204 1 9.29388 1 12C1 14.7061 3.08833 16.898 5.66667 16.898C7.19208 16.898 8.54542 16.1296 9.39708 14.9449L15.1371 19.3071C15.0467 19.6316 15 19.9745 15 20.3265C15 22.3531 16.5692 24 18.5 24C20.4308 24 22 22.3531 22 20.3265C22 18.3 20.4308 16.6531 18.5 16.6531ZM18.5 2.08163C19.3371 2.08163 20.0167 2.7949 20.0167 3.67347C20.0167 4.55204 19.3371 5.26531 18.5 5.26531C17.6629 5.26531 16.9833 4.55204 16.9833 3.67347C16.9833 2.7949 17.6629 2.08163 18.5 2.08163ZM5.66667 14.6939C4.25208 14.6939 3.1 13.4847 3.1 12C3.1 10.5153 4.25208 9.30612 5.66667 9.30612C7.08125 9.30612 8.23333 10.5153 8.23333 12C8.23333 13.4847 7.08125 14.6939 5.66667 14.6939ZM18.5 21.9184C17.6629 21.9184 16.9833 21.2051 16.9833 20.3265C16.9833 19.448 17.6629 18.7347 18.5 18.7347C19.3371 18.7347 20.0167 19.448 20.0167 20.3265C20.0167 21.2051 19.3371 21.9184 18.5 21.9184Z" fill="currentColor" />
  </Icon>
);

export const GiftIcon = ({ props }) => (
  <Icon {...props}>
    <path d="M11.9993 4.494C11.9996 4.49625 12 4.4985 12 4.5H6C3.9285 4.5 3 3.492 3 2.25C3 1.008 3.9285 0 6 0C7.92 0 9.438 0.855 10.47 1.8555C10.911 1.6065 11.4135 1.4535 11.9565 1.4535C12.5235 1.4535 13.047 1.617 13.5 1.8855C14.5335 0.873 16.0605 0 18 0C20.0715 0 21 1.008 21 2.25C21 3.492 20.0715 4.5 18 4.5H12C12 4.497 12.0015 4.491 12.003 4.488H11.9985C11.9985 4.48949 11.9989 4.49173 11.9992 4.49397L11.9993 4.494ZM13.5315 6H22.5C23.328 6 24 6.672 24 7.5V12H22.5V22.5C22.5 23.328 21.828 24 21 24H13.5315H10.5H3C2.172 24 1.5 23.328 1.5 22.5V12H0V7.5C0 6.672 0.672 6 1.5 6H10.5H13.5315ZM10.5 10.5V7.5H1.5V10.5H10.5ZM3 22.5V12H10.5V22.5H3ZM13.5314 22.5H20.9999V12H13.5314V22.5ZM22.4999 10.5H13.5314V7.5H22.4999V10.5ZM19.5 2.25C19.5 2.8695 18.684 3 18 3H14.5934C14.5883 2.99104 14.5835 2.98181 14.5787 2.97266C14.5722 2.96035 14.5658 2.94818 14.5589 2.937C15.3209 2.196 16.476 1.5 18 1.5C18.684 1.5 19.5 1.6305 19.5 2.25ZM6 1.5C5.316 1.5 4.5 1.6305 4.5 2.25C4.5 2.8695 5.316 3 6 3H9.3195C9.32875 2.98396 9.33724 2.96768 9.3457 2.95145C9.35782 2.9282 9.36987 2.90508 9.384 2.883C8.622 2.1675 7.491 1.5 6 1.5Z" fill="currentColor" />
  </Icon>
);

export const ApplyCreditCardIcon = ({ props }) => (
  <Icon {...props}>
    <path d="M11.5465 16.5262C11.4544 16.5569 11.3708 16.6086 11.3022 16.6772C11.2336 16.7458 11.1819 16.8294 11.1512 16.9215L10 20.375L10.0916 20.4666L11.9059 18.6524C11.893 18.6024 11.8752 18.5541 11.8752 18.5C11.8752 18.1549 12.1551 17.875 12.5002 17.875C12.8453 17.875 13.1252 18.1549 13.1252 18.5C13.1252 18.8451 12.8453 19.125 12.5002 19.125C12.4461 19.125 12.3979 19.1072 12.3479 19.0943L10.5336 20.9086L10.625 21L14.0785 19.8488C14.1706 19.8182 14.2543 19.7665 14.3229 19.6979C14.3915 19.6293 14.4432 19.5456 14.4738 19.4535L15.1197 17.8115L13.1885 15.8803L11.5465 16.5262ZM17.2119 11.5532L13.6356 15.4494L15.5467 17.3606L19.443 13.7842C21.1016 12.318 18.6666 9.90746 17.2119 11.5532Z" fill="currentColor" />
    <path d="M9.87406 18H4.28309C2.48856 18 2 17.4519 2 15.5V4.5C2 2.54806 2.20547 2 4 2H20C21.7945 2 22 2.55792 22 4.5V15.5C22 17.4421 21.7945 18 20 18H16.1359L17.3359 16.8986L19.2364 16.8832C20.5 16.8832 21 16.5 21 14.9538V12.5252C21 12.5251 21 12.525 21 12.5249V7.89526H3V14.9538C3 16.5 3.5 17 4.76357 17L10.2221 16.956L9.87406 18ZM4.28309 3C3 3 3 3.5536 3 4.5V5.75601H21V4.5C21 3.5536 21 3 19.5 3H4.28309Z" fill="currentColor" />
    <path d="M8.11005 15H5.88995C5.36364 15 5 14.6882 5 14.2331V12.7584C5 12.3118 5.36364 12 5.88995 12H8.11005C8.64593 12 9 12.3118 9 12.7584V14.2331C9 14.6882 8.64593 15 8.11005 15Z" fill="currentColor" />
  </Icon>
);

export const CardLessIcon = ({ props }) => (
  <Icon {...props}>
    <path d="M17.4183 2C18.8405 2 20.0001 3.08664 20.0001 4.41918V19.583C20.0001 20.9155 18.8405 21.9999 17.4183 21.9999H17.1816C17.1752 22 17.1688 22 17.1624 21.9999H6.83558H6.82232H6.58182C5.15963 21.9999 4 20.9156 4 19.583V4.41921C4 3.25712 4.88194 2.28204 6.05085 2.05161C6.22234 2.01779 6.40001 2 6.58198 2H17.4183ZM17.4183 21.1757H17.1778H17.1645H6.83769C6.83128 21.1756 6.82489 21.1756 6.81852 21.1758H6.58182C5.63175 21.1758 4.87954 20.4732 4.87954 19.583V18.1058H7.80877H7.82283H16.1753L16.1877 18.1058L16.195 18.1057H19.1206V19.583C19.1206 20.4732 18.3684 21.1757 17.4183 21.1757ZM7.82484 17.2816H16.1773H16.1913H19.1206V10.7886C19.1187 10.773 19.1179 10.7571 19.118 10.7412V4.41921C19.118 3.52906 18.3682 2.82474 17.4181 2.82474H6.58182C6.48722 2.82474 6.39459 2.83173 6.30447 2.84518C5.48994 2.96693 4.88212 3.61773 4.88212 4.41918V10.7412C4.88223 10.7571 4.88136 10.7729 4.87954 10.7886V17.2816H7.80508C7.81164 17.2815 7.81824 17.2815 7.82484 17.2816ZM14.1581 13.1665C14.4914 12.8498 14.6581 12.4665 14.6581 12.0165C14.6581 11.6554 14.5664 11.3665 14.3831 11.1498C14.2053 10.9276 13.9831 10.761 13.7164 10.6498C13.4553 10.5387 13.1247 10.436 12.7247 10.3415V8.65818C13.2025 8.71373 13.6525 8.86373 14.0747 9.10818L14.4164 8.26651C14.1942 8.12207 13.9331 8.0054 13.6331 7.91651C13.3386 7.82763 13.0358 7.77485 12.7247 7.75818V6.83318H12.0414V7.77485C11.4192 7.83596 10.9442 8.02485 10.6164 8.34151C10.2886 8.65818 10.1247 9.04151 10.1247 9.49151C10.1247 9.85262 10.2136 10.1443 10.3914 10.3665C10.5692 10.5832 10.7886 10.7498 11.0497 10.8665C11.3164 10.9776 11.647 11.0804 12.0414 11.1748V12.8415C11.7247 12.8137 11.4192 12.7443 11.1247 12.6332C10.8303 12.5165 10.5803 12.3748 10.3747 12.2082L9.99973 13.0498C10.2164 13.2387 10.5081 13.3943 10.8747 13.5165C11.2414 13.6387 11.6303 13.7137 12.0414 13.7415V14.6665H12.7247V13.7332C13.3525 13.6665 13.8303 13.4776 14.1581 13.1665ZM11.4164 9.88318C11.272 9.77207 11.1997 9.62484 11.1997 9.44151C11.1997 9.24707 11.2692 9.08318 11.4081 8.94985C11.547 8.81651 11.7581 8.72762 12.0414 8.68318V10.1665C11.7692 10.0887 11.5608 9.99429 11.4164 9.88318ZM13.3747 12.5665C13.2358 12.6943 13.0192 12.7804 12.7247 12.8248V11.3498C13.0025 11.4276 13.2164 11.5248 13.3664 11.6415C13.5164 11.7526 13.5914 11.9026 13.5914 12.0915C13.5914 12.2804 13.5192 12.4387 13.3747 12.5665ZM11.417 3.66677C11.269 3.66388 11.1309 3.74122 11.0561 3.86898C10.9812 3.99674 10.9812 4.15499 11.0561 4.28275C11.1309 4.41051 11.269 4.48785 11.417 4.48496H13.4274C13.5754 4.48785 13.7135 4.41051 13.7884 4.28275C13.8632 4.15499 13.8632 3.99674 13.7884 3.86898C13.7135 3.74122 13.5754 3.66388 13.4274 3.66677H11.417ZM10.9999 19.6179C10.9998 19.1336 11.3923 18.7409 11.8766 18.7407C12.1092 18.7407 12.3324 18.8331 12.4969 18.9976C12.6614 19.1621 12.7538 19.3853 12.7538 19.6179C12.7536 20.1022 12.3609 20.4947 11.8766 20.4946C11.3925 20.4944 11.0001 20.102 10.9999 19.6179Z" fill="currentColor" />
  </Icon>
);

export const EBankIcon = ({ props }) => (
  <Icon {...props}>
    <path d="M4 3.2H20C20.4418 3.2 20.8 3.55817 20.8 4V9.72594L22 11.0181V4C22 2.89543 21.1046 2 20 2H4C2.89543 2 2 2.89543 2 4V17C2 18.1046 2.89543 19 4 19H11.9866C12.2355 18.755 12.4212 18.4943 12.5624 18.214C12.602 18.1353 12.6389 17.9898 12.6732 17.8H4C3.55817 17.8 3.2 17.4418 3.2 17V4C3.2 3.55817 3.55817 3.2 4 3.2ZM11.8599 10.0638L10.6519 11.3516L10.647 11.357C10.4721 11.5493 10.3129 11.76 10.1961 12H4.8C4.35714 12 4 11.7121 4 11.3571V10.7143C4 9.64955 5.075 8.78571 6.4 8.78571H6.57857C6.70159 8.83353 6.82769 8.87558 6.95655 8.91133C7.28786 9.00324 7.63745 9.05357 8 9.05357C8.35963 9.05357 8.70833 9.00405 9.037 8.91354C9.16854 8.87732 9.29688 8.83452 9.42143 8.78571H9.6C10.641 8.78571 11.5276 9.31889 11.8599 10.0638ZM19.4001 17.8C19.2922 18.211 19.1695 18.6164 19.032 19H20C21.1046 19 22 18.1046 22 17V14.391C21.7788 14.4896 21.5359 14.5427 21.2875 14.5427H20.8V17C20.8 17.4418 20.4418 17.8 20 17.8H19.4001ZM4 14.5C4 14.2239 4.22386 14 4.5 14H9.5C9.77614 14 10 14.2239 10 14.5C10 14.7761 9.77614 15 9.5 15H4.5C4.22386 15 4 14.7761 4 14.5ZM4 16.5C4 16.2239 4.22386 16 4.5 16H9.5C9.77614 16 10 16.2239 10 16.5C10 16.7761 9.77614 17 9.5 17H4.5C4.22386 17 4 16.7761 4 16.5ZM7.17804 8.14255C6.32244 7.83255 5.71429 7.05326 5.71429 6.14286C5.71429 4.96094 6.73929 4 8 4C9.26071 4 10.2857 4.96094 10.2857 6.14286C10.2857 7.055 9.67524 7.83552 8.81707 8.14432C8.56325 8.23565 8.28777 8.28571 8 8.28571C7.71038 8.28571 7.4332 8.235 7.17804 8.14255Z" fill="currentColor" />
    <path d="M13.9405 12.6041C14.4928 12.6041 14.9405 13.0519 14.9405 13.6041L14.9405 13.7711C14.9405 14.9977 14.7791 16.538 14.3516 17.9326C14.0147 19.0315 13.4671 20.1872 12.5719 20.9603C15.8881 20.5734 18.0535 17.4697 18.0535 13.7711L18.0535 13.6041C18.0535 13.0519 18.5012 12.6041 19.0535 12.6041L20.8296 12.6041L16.5031 7.94548L12.1331 12.6041L13.9405 12.6041ZM11.3361 11.9921L15.8363 7.19458C16.0534 6.95695 16.2959 6.87988 16.5002 6.87988C16.7108 6.87988 16.947 6.95695 17.1704 7.19458L21.626 11.9921C21.9387 12.3261 22.0664 12.538 22.0664 12.8463C22.0664 13.2894 21.7153 13.6041 21.2876 13.6041L19.0535 13.6041L19.0535 13.7711C19.0535 18.0806 16.3087 22.0009 11.8659 22.0009C11.2659 22.0009 10.9404 21.6862 10.9404 21.3329C10.9404 21.0504 11.017 20.7678 11.4191 20.5494C13.1088 19.6397 13.7829 16.8353 13.9153 14.6041C13.9324 14.3151 13.9405 14.0356 13.9405 13.7711L13.9405 13.6041L11.6744 13.6041C11.2468 13.6041 10.934 13.2894 10.934 12.8527C10.934 12.5444 11.0616 12.294 11.3361 11.9921Z" fill="currentColor" />
  </Icon>
);

export const QRCodeTransferIcon = ({ props }) => (
  <Icon {...props}>
    <path d="M3 3V10H10V3H3ZM2 2.64286C2 2.288 2.288 2 2.64286 2H10.3571C10.712 2 11 2.288 11 2.64286V10.3571C11 10.712 10.712 11 10.3571 11H2.64286C2.288 11 2 10.712 2 10.3571V2.64286Z" fill="currentColor" />
    <path d="M14 3V10H21V3H14ZM13 2.64286C13 2.288 13.288 2 13.6429 2H21.3571C21.712 2 22 2.288 22 2.64286V10.3571C22 10.712 21.712 11 21.3571 11H13.6429C13.288 11 13 10.712 13 10.3571V2.64286Z" fill="currentColor" />
    <path d="M3 14V21H10V14H3ZM2 13.6429C2 13.288 2.288 13 2.64286 13H10.3571C10.712 13 11 13.288 11 13.6429V21.3571C11 21.712 10.712 22 10.3571 22H2.64286C2.288 22 2 21.712 2 21.3571V13.6429Z" fill="currentColor" />
    <path d="M21.3333 22C21.7013 22 22 21.6945 22 21.3182V17.9091H20.6667V20.6364H18V22H21.3333Z" fill="currentColor" />
    <path d="M16.3333 22C16.7013 22 17 21.6945 17 21.3182V17.9091H15.6667V20.6364H13V22H16.3333Z" fill="currentColor" />
    <path d="M18.8302 17.9092V16.6819H19.5972C20.0206 16.6819 20.3643 16.407 20.3643 16.0683V13.0001H18.8302V15.4546H17.2961V13.0001H15.762V16.0683C15.762 16.407 16.1056 16.6819 16.529 16.6819H17.2961V17.9092H18.8302Z" fill="currentColor" />
    <path d="M13.9204 17.9092V13.0001H13V17.9092H13.9204Z" fill="currentColor" />
  </Icon>
);
