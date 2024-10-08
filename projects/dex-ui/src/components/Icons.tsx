import * as React from "react";

export type SVGProps = {
  color?: string;
  width?: number;
  height?: number;
};

export const ChevronDown = ({ color = "#000", width, height }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 10 6" fill="none">
    <path d="M1 1L5 5L9 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Discord = ({ color = "#000", width, height }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 20 16" fill="none">
    <path
      fill={color}
      fillRule="evenodd"
      d="M5.83 1.146c-.993.287-1.914.692-2.674 1.175-.538.342-.624.446-1.026 1.237a23.368 23.368 0 0 0-.772 1.718C.684 7.002.046 10.044.016 11.67L0 12.563l.72.592c1.184.974 2.977 1.71 4.547 1.868l.607.06.318-.433c.176-.238.359-.433.407-.433.254 0-.058-.232-.626-.466-.66-.272-2.102-1.158-2.392-1.47-.093-.1.271.034.864.319 1.61.772 3.394 1.148 5.44 1.148 2.258 0 4.45-.501 5.952-1.36l.576-.33-.417.363c-.535.466-1.75 1.18-2.367 1.392a8.15 8.15 0 0 0-.52.19c-.102.065.643.976.839 1.025.338.085 1.596-.143 2.51-.454a8.592 8.592 0 0 0 2.737-1.538c.729-.604.72-.559.48-2.443-.335-2.646-1.02-5.022-2.012-6.977-.46-.908-.484-.935-1.145-1.347-.8-.5-1.857-.953-2.739-1.173-.952-.237-1.22-.239-1.346-.007-.167.303-.122.347.524.518.343.09.624.199.624.24 0 .042.14.106.312.141.171.036.377.116.456.18.08.062.349.228.6.368.566.315.589.394.048.163-.953-.408-2.027-.664-3.617-.862-1.886-.236-4.874.131-6.432.79-.425.18-.773.316-.773.302 0-.054 1.117-.686 1.536-.87.848-.372 1.43-.59 1.577-.59.175 0 .191-.125.051-.38-.133-.244-.519-.229-1.51.057ZM7.752 7.43c.418.302.677.852.677 1.438 0 1.716-1.998 2.3-2.786.815-.242-.455-.213-1.247.063-1.723.127-.219.288-.398.357-.398.07 0 .127-.044.127-.097 0-.31 1.147-.335 1.562-.035Zm5.935.095c.516.482.7 1.067.55 1.748-.274 1.252-1.65 1.683-2.468.773-.541-.602-.603-1.378-.17-2.147.423-.752 1.48-.941 2.088-.374Zm6.235 4.216c.005.109.028.131.058.056.028-.067.024-.148-.007-.18-.032-.03-.055.025-.05.124Z"
      clipRule="evenodd"
    />
  </svg>
);

export const Twitter = ({ color = "#000", width, height }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 20 16" fill="none">
    <path
      fill={color}
      fillRule="evenodd"
      d="M13.605.087c-.431.027-.87.123-1.271.276a5.05 5.05 0 0 0-.284.124 4.07 4.07 0 0 0-1.4 1.089 3.926 3.926 0 0 0-.806 3.403c0 .009-.108.003-.38-.018a11.842 11.842 0 0 1-5.992-2.205A11.699 11.699 0 0 1 1.462.9a.852.852 0 0 0-.078-.085 3.907 3.907 0 0 0-.211 3.614A4.045 4.045 0 0 0 2.64 6.143a2.296 2.296 0 0 1-.322-.02 4.163 4.163 0 0 1-1.387-.405l-.141-.07.005.179C.828 7.005 1.397 8.1 2.367 8.85c.114.088.383.262.518.336a4.232 4.232 0 0 0 1.162.425c.031 0 .016.013-.026.023a4.213 4.213 0 0 1-1.673.07.76.76 0 0 0-.111-.012c-.006.006.07.211.126.34.348.797.963 1.47 1.741 1.905a4.21 4.21 0 0 0 1.856.526l.103.005-.148.107a8.399 8.399 0 0 1-5.807 1.556.9.9 0 0 0-.108-.008c-.008.008.398.246.66.387a11.88 11.88 0 0 0 5.022 1.391c.434.023 1.035.018 1.502-.012 2.607-.17 4.946-1.11 6.822-2.74a11.436 11.436 0 0 0 2.139-2.49c.395-.617.767-1.35 1.037-2.041.423-1.084.678-2.187.762-3.303.023-.299.031-.589.027-.945l-.003-.349.134-.1A8.258 8.258 0 0 0 19.65 2.44c.157-.195.361-.475.35-.48a.469.469 0 0 0-.084.031 8.433 8.433 0 0 1-2.249.587 4.479 4.479 0 0 0 .557-.395c.12-.101.331-.306.433-.421.28-.319.514-.687.68-1.07.046-.108.12-.31.115-.315a.857.857 0 0 0-.103.053 8.407 8.407 0 0 1-2.307.87l-.19.042-.13-.123A4.137 4.137 0 0 0 14.14.09a7.057 7.057 0 0 0-.534-.003Z"
      clipRule="evenodd"
    />
  </svg>
);

export const Github = ({ color = "#000", width, height }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 20 20" fill="none">
    <path
      fill={color}
      fillRule="evenodd"
      d="M8.645.404a9.818 9.818 0 0 0-3.018.919C2.72 2.725.727 5.338.13 8.526c-.14.747-.173 2.177-.07 2.96a9.979 9.979 0 0 0 1.937 4.728c.373.492 1.187 1.335 1.657 1.715.785.634 1.914 1.284 2.773 1.594.514.186.734.194.927.032.192-.162.214-.333.172-1.363l-.034-.858-.172.031a8.571 8.571 0 0 1-.695.058c-1.282.066-2.044-.366-2.573-1.457-.28-.576-.553-.943-.862-1.156-.583-.402-.665-.56-.343-.656.149-.045.246-.045.44 0 .542.124.968.442 1.332.994.645.977 1.56 1.296 2.648.923l.26-.09.084-.319c.1-.38.224-.634.417-.853a.88.88 0 0 0 .142-.192c0-.016-.063-.03-.14-.03-.234 0-1.119-.185-1.511-.316-1.236-.413-2.06-1.157-2.501-2.26-.246-.614-.323-1.045-.35-1.964-.024-.77-.016-.898.075-1.26.13-.515.405-1.09.689-1.438l.222-.274-.084-.272c-.117-.379-.116-1.392.002-1.794.187-.634.204-.645.796-.525.473.096 1.09.357 1.69.715l.45.269.414-.096C8.623 5.209 9.11 5.16 10 5.16c.89 0 1.377.05 2.078.212l.413.096.451-.27c.6-.357 1.217-.618 1.69-.714.593-.12.61-.11.796.525.117.402.119 1.415.002 1.794l-.084.272.216.266c.255.313.495.773.642 1.233.136.424.184 1.527.095 2.18-.299 2.203-1.61 3.44-4.017 3.787a4.702 4.702 0 0 0-.446.076c-.01.008.052.095.137.192.166.19.302.463.42.848.06.195.074.55.076 1.989l.003 1.75.155.14c.206.183.412.18.946-.013.859-.31 1.988-.96 2.773-1.594.47-.38 1.284-1.223 1.657-1.715a9.979 9.979 0 0 0 1.937-4.728c.103-.783.07-2.213-.07-2.96-.443-2.368-1.629-4.383-3.495-5.94-1.086-.905-2.671-1.683-4.117-2.02C11.236.33 9.708.26 8.645.404ZM3.52 14.476c.023.117.166.194.234.126.085-.086.012-.204-.126-.204-.09 0-.12.021-.108.078Zm.401.327c-.032.084.14.275.223.247.08-.027.098-.17.03-.25-.074-.09-.217-.089-.253.003Zm.398.562c0 .061.043.15.095.196.077.07.107.075.166.026.092-.077.092-.165-.003-.26-.116-.115-.258-.095-.258.038Zm.505.484c-.09.09-.038.226.12.311.079.042.115.037.176-.024.087-.087.047-.188-.12-.298-.086-.057-.11-.056-.176.01Zm.636.514c0 .142.2.245.336.172.187-.1.072-.284-.179-.284-.133 0-.157.018-.157.112Zm1.644-.049c-.141.104-.077.247.11.247.194 0 .294-.119.199-.234-.077-.092-.194-.097-.309-.013Zm-.752.084c-.126.073-.105.227.035.262.233.058.407-.124.236-.249-.103-.076-.159-.079-.271-.013Z"
      clipRule="evenodd"
    />
  </svg>
);

export const Etherscan = ({ color = "#000", width, height }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 20 20" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.95794 0.222249C4.25392 1.04107 1.32181 3.81349 0.322619 7.44179C-0.258599 9.55251 -0.0433039 12.1916 0.878127 14.2535C1.40146 15.4244 1.72448 15.6674 2.7579 15.6674C4.16891 15.6674 4.1656 15.675 4.21859 12.1564C4.27159 8.63391 4.24446 8.69869 5.67092 8.69869C7.13115 8.69869 7.12247 8.68016 7.17578 11.9312C7.20102 13.4779 7.26458 14.7863 7.31695 14.8389C7.36915 14.8915 7.6059 14.8661 7.8428 14.7827L8.27339 14.6308L8.35225 10.8967C8.41219 8.05741 8.48301 7.10001 8.64752 6.90125C8.80934 6.70581 9.12811 6.6404 9.90932 6.64214C10.4844 6.64356 11.0612 6.71214 11.1913 6.7945C11.385 6.91724 11.4422 7.54632 11.5068 10.2632L11.5856 13.582L12.0982 13.3653L12.6108 13.1487V9.10224C12.6108 5.19709 12.6225 5.04425 12.9436 4.72179C13.2305 4.4337 13.4174 4.3968 14.3032 4.4535C15.7814 4.54789 15.7653 4.50687 15.7653 8.17461C15.7653 9.8566 15.8119 11.2328 15.8688 11.2328C16.1065 11.2328 17.1805 10.3225 18.2449 9.2188C19.755 7.65307 19.8085 7.37417 18.9367 5.60777C16.9131 1.50718 12.3255 -0.743229 7.95794 0.222249ZM19.0315 10.5701C16.3242 13.9404 11.4046 16.6496 5.96461 17.766C5.02236 17.9594 4.2514 18.1549 4.2514 18.2003C4.2514 18.394 5.80057 19.1984 6.91191 19.5817C7.92214 19.9303 8.39468 19.9976 9.85064 20C12.8801 20.0052 14.9709 19.1595 17.042 17.0907C17.9618 16.172 18.3927 15.5829 18.8982 14.5533C19.6148 13.0943 20.0662 11.276 19.9921 10.1482L19.9451 9.43309L19.0315 10.5701Z"
      fill={color}
    />
  </svg>
);

export const BeanstalkLogoBlack = ({ color = "#000", width = 24, height = 24 }: SVGProps) => (
  <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="24" fill={color} />
    <path d="M30.7438 5.05786L16.7279 42.5026C16.7279 42.5026 1.18757 15.9919 30.7438 5.05786Z" fill="white" />
    <path d="M19.9849 40.1793L29.8344 13.4126C29.8344 13.4126 47.9863 28.0973 19.9849 40.1793Z" fill="white" />
  </svg>
);

export const YieldSparkle = ({ color = "#000", width = 16, height = 16 }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none">
    <path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.43 8.623 1.422.54a4 4 0 0 1 2.318 2.319l.54 1.421a.667.667 0 0 0 1.247 0l.54-1.421a4 4 0 0 1 2.318-2.319l1.422-.54a.667.667 0 0 0 0-1.246l-1.422-.54a4 4 0 0 1-2.318-2.319l-.54-1.422a.667.667 0 0 0-1.247 0l-.54 1.422a4 4 0 0 1-2.318 2.318l-1.422.54a.667.667 0 0 0 0 1.247Z"
      clipRule="evenodd"
    />
    <path stroke={color} strokeLinecap="round" strokeLinejoin="round" d="M4 14v-2.666M2.667 12.667h2.666M3.333 4.667V2M2 3.333h2.667" />
  </svg>
);

export const WellFunction = ({ color = "#000", width = 14, height = 14 }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none">
    <path stroke={color} strokeLinecap="round" strokeLinejoin="round" d="M5 1.349a5.996 5.996 0 1 0 4.69 11.008" />
    <path stroke={color} strokeLinecap="round" strokeLinejoin="round" d="M7 1v6l4.243 4.243A6 6 0 0 0 7 1h0Z" clipRule="evenodd" />
  </svg>
);

export const X = ({ color = "#000", width = 24, height = 24 }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none">
    <path fill={color} d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19Z" />
  </svg>
);

export const Copy = ({ color = "#000", width = 24, height = 24 }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none">
    <path
      stroke={color}
      d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
    />
  </svg>
);

export const Error = ({ color = "#000", width = 19, height = 19 }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="2 2 19 19">
    <path
      fill={color}
      fillRule="evenodd"
      d="M7.91 3.23 3.23 7.913v-.01a.81.81 0 0 0-.23.57v7.054c0 .22.08.42.23.57L7.9 20.77c.15.15.36.23.57.23h7.06c.22 0 .42-.08.57-.23l4.67-4.673a.81.81 0 0 0 .23-.57V8.473c0-.22-.08-.42-.23-.57L16.1 3.23a.81.81 0 0 0-.57-.23H8.48c-.22 0-.42.08-.57.23ZM12 7a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm-1 9a1 1 0 0 1 1-1h.008a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1Z"
      clipRule="evenodd"
    />
  </svg>
);

export const Success = ({ color = "#000", width = 24, height = 24 }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 52 52">
    <path
      fill={color}
      d="M26 2C12.7 2 2 12.7 2 26s10.7 24 24 24 24-10.7 24-24S39.3 2 26 2zm13.4 18L24.1 35.5c-.6.6-1.6.6-2.2 0L13.5 27c-.6-.6-.6-1.6 0-2.2l2.2-2.2c.6-.6 1.6-.6 2.2 0l4.4 4.5c.4.4 1.1.4 1.5 0L35 15.5c.6-.6 1.6-.6 2.2 0l2.2 2.2c.7.6.7 1.6 0 2.3z"
    />
  </svg>
);

export const Info = ({ color = "#000", width = 16, height = 16 }: SVGProps) => (
  <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.6676 14.0025H5.33204C3.4906 14.0025 1.99731 12.5092 1.99731 10.6678V5.33222C1.99731 3.49079 3.4906 1.9975 5.33204 1.9975H10.6676C12.509 1.9975 14.0023 3.49079 14.0023 5.33222V10.6678C14.0023 12.5092 12.509 14.0025 10.6676 14.0025Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.99907 5.33223C7.90703 5.33223 7.83233 5.40693 7.833 5.49897C7.833 5.59101 7.9077 5.66571 7.99973 5.66571C8.09177 5.66571 8.16647 5.59101 8.16647 5.49897C8.16647 5.40693 8.09177 5.33223 7.99907 5.33223"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M8.16646 10.7905V7.6225H7.49951" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Logo = ({ width = 24, height = 24 }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none">
    <circle cx={12} cy={12} r={12} fill="#F9F8F6" />
    <g clipPath="url(#a)">
      <mask
        id="b"
        width={16}
        height={14}
        x={4}
        y={6}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance"
        }}
      >
        <path
          fill="#fff"
          d="M12.542 19.714v-7.53H20c0 4.159-3.339 7.53-7.458 7.53Zm-1.084 0v-7.53H4c0 4.159 3.339 7.53 7.458 7.53ZM17.65 6h-5.135v5.185c2.836 0 5.135-2.321 5.135-5.185Zm-6.192 5.185V6H6.323c0 2.864 2.3 5.185 5.136 5.185Z"
        />
      </mask>
      <g mask="url(#b)">
        <path fill="#46B955" d="M1.72 23.499h22.463V.817H1.719V23.5Z" />
        <path
          fill="#29A334"
          d="M22.415 10.756c-3.346-.396-6.165-2.907-7.959-4.658-2.105-2.055-4.896-3.017-6.37-2.42-1.016.412-1.281 1.72-.533 2.755.747 1.035 1.338 4.606.539 6.47-.913 2.128-3.554 2.276-3.554 6.163v5.608h20.526V10.756h-2.65Z"
        />
        <path
          fill="#000"
          d="M22.415 10.756c-3.346-.396-6.165-2.907-7.959-4.658-2.105-2.055-4.896-3.017-6.37-2.42-1.016.412-1.281 1.72-.533 2.755.747 1.035 1.338 4.606.539 6.47-.913 2.128-3.554 2.276-3.554 6.163v5.608h20.526V10.756h-2.65Z"
          opacity={0.06}
          style={{
            mixBlendMode: "multiply"
          }}
        />
        <path
          fill="#1B8E21"
          d="M8.525 21.482s-2.863-1.914-2.35-3.093c.562-1.292 2.389-.967 3.668-2.054 1.296-1.1.995-2.932.332-4.54-.902-2.188-1.852-4.301-.303-6.108.911-1.063 2.796-.766 3.853.928 1.018 1.632 2.396 3.848 4.085 3.94 1.217.065 3.165.486 4.974 3.078h2.227v10.809H8.525v-2.96Z"
        />
        <path
          fill="#000"
          d="M8.525 21.482s-2.863-1.914-2.35-3.093c.562-1.292 2.389-.967 3.668-2.054 1.296-1.1.995-2.932.332-4.54-.902-2.188-1.852-4.301-.303-6.108.911-1.063 2.796-.766 3.853.928 1.018 1.632 2.396 3.848 4.085 3.94 1.217.065 3.165.486 4.974 3.078h2.227v10.809H8.525v-2.96Z"
          opacity={0.06}
          style={{
            mixBlendMode: "multiply"
          }}
        />
        <path
          fill="#0C720E"
          d="M9.795 22.567c-1.208-3.277.954-3.621 2.02-3.988 1.065-.366 2.154-.979 2.17-2.451.017-1.553-.968-2.03-1.718-3.084-.75-1.054-2.69-2.588-1.328-3.806 1.096-.98 2.99 1.519 4.75 1.519 1.76 0 5.63 1.2 6.195 2.148l1.567.282v9.38H9.795Z"
        />
        <path
          fill="#000"
          d="M9.795 22.567c-1.208-3.277.954-3.621 2.02-3.988 1.065-.366 2.154-.979 2.17-2.451.017-1.553-.968-2.03-1.718-3.084-.75-1.054-2.69-2.588-1.328-3.806 1.096-.98 2.99 1.519 4.75 1.519 1.76 0 5.63 1.2 6.195 2.148l1.567.282v9.38H9.795Z"
          opacity={0.06}
          style={{
            mixBlendMode: "multiply"
          }}
        />
      </g>
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M4 6h16v13.714H4z" />
      </clipPath>
    </defs>
  </svg>
);

export const RightArrowCircle = ({ width = 24, height = 24 }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none">
    <path
      stroke="#4B5563"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21v0a9 9 0 0 1-9-9v0a9 9 0 0 1 9-9v0a9 9 0 0 1 9 9v0a9 9 0 0 1-9 9Z"
      clipRule="evenodd"
    />
    <path stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round" d="M16 12H8M13 9l3 3-3 3" />
  </svg>
);

export const RightArrow = ({ color = "#000", width = 24, height = 24 }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 16" fill="none">
<path d="M2.5 8H13.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M9 3.5L13.5 8L9 12.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
);

export const LeftArrow = ({ color = "#000", width = 24, height = 24 }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 16" fill="none">
    <path d="M13.5 8H2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 3.5L2.5 8L7 12.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const BurgerMenuIcon = ({ color = "#000", width = 24, height = 24 }: SVGProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="4" y1="7" x2="20" y2="7" stroke={color} strokeWidth="2" />
    <line x1="4" y1="15" x2="20" y2="15" stroke={color} strokeWidth="2" />
  </svg>
);

export const CheckIcon = ({ color = "#000", width = 16, height = 16 }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 17 18" fill="none">
    <path d="M7.08333 12.1166L4.25 9.28325L5.24167 8.29159L7.08333 10.1333L11.7583 5.45825L12.75 6.44992L7.08333 12.1166Z" fill={color}/>
  </svg>
)

export const CircleFilledCheckIcon = ({ color = "#000", width = 16, height = 16 }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 16" fill="none">
    <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill={color} />
    <path d="M11.4375 6.125L6.85156 10.5L4.5625 8.3125" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CircleEmptyIcon = ({ color = "#000", width = 16, height = 16 }: SVGProps) => (
  <svg height={height} width={width} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="1" fill="none" />
  </svg>
);

export const SearchIcon = ({ color = "#000", width = 16, height = 16 }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 17 16" fill="none">
    <path d="M7.75 12.5C10.6495 12.5 13 10.1495 13 7.25C13 4.35051 10.6495 2 7.75 2C4.85051 2 2.5 4.35051 2.5 7.25C2.5 10.1495 4.85051 12.5 7.75 12.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.4625 10.9624L14.5 13.9999" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const XIcon = ({ color = "#000", width = 16, height = 16 }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 10 10" fill="none">
    <path d="M1 1L9 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 9L9 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 1L9 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 9L9 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)