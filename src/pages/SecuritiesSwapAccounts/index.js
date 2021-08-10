import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCheckLocation, usePageInfo } from 'hooks';
import { ArrowForwardIos } from '@material-ui/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import DebitCard from 'components/DebitCard';
import DetailCard from 'components/DetailCard';

/* Styles */
import SecuritiesSwapAccountsWrapper from './securitiesSwapAccounts.style';

const SecuritiesSwapAccounts = () => {
  const ref = useRef();
  // mock data
  const cardInfo = {
    cardBranch: '信義分行',
    cardName: '證券交割帳戶',
    cardAccount: '043-004-99001234',
    cardBalance: 2000000,
    functionList: [
      { title: '轉帳', path: '/transfer', icon: null },
      { title: '換匯', path: '/exchange', icon: null },
    ],
    moreList: [
      { title: '設定為主要證券交割帳戶', path: '/', icon: 'radio_button_unchecked' },
      { title: '帳戶名稱編緝', path: '/', icon: 'radio_button_unchecked' },
    ],
  };
  const computedCardList = [
    {
      id: 1,
      avatar: null,
      title: '12月的伙食費',
      type: 'income',
      date: '12/08',
      sender: 'Amanda Wilkins',
      amount: 1200,
      balance: 212489283,
    },
    {
      id: 2,
      avatar: null,
      title: '跨行轉入',
      type: 'income',
      date: '12/08',
      sender: '345-17282981',
      amount: 2650,
      balance: 212489874,
    },
    {
      id: 3,
      avatar: null,
      title: '跨行轉入',
      type: 'income',
      date: '12/08',
      sender: '345-17282981',
      amount: 2650,
      balance: 212489874,
    },
  ];

  // eslint-disable-next-line no-unused-vars
  const handleChangeSlide = (swiper) => {};

  const renderDetailCardList = (list) => (
    list.map((card) => {
      const {
        id,
        avatar,
        title,
        type,
        date,
        sender,
        amount,
        balance,
      } = card;
      return (
        <DetailCard
          key={id}
          avatar={avatar}
          title={title}
          type={type}
          date={date}
          sender={sender}
          amount={amount}
          balance={balance}
        />
      );
    })
  );

  const renderDebitCard = (info) => {
    const {
      cardBranch,
      cardName,
      cardAccount,
      cardBalance,
      functionList,
      moreList,
    } = info;
    return (
      <>
        <SwiperSlide>
          <DebitCard
            type="original"
            branch={cardBranch}
            cardName={cardName}
            account={cardAccount}
            balance={cardBalance}
            functionList={functionList}
            moreList={moreList}
            moreDefault={false}
            color="yellow"
          />
        </SwiperSlide>
        <SwiperSlide>
          <DebitCard
            type="original"
            branch={cardBranch}
            cardName={cardName}
            account={cardAccount}
            balance={cardBalance}
            functionList={functionList}
            moreList={moreList}
            moreDefault={false}
            color="yellow"
          />
        </SwiperSlide>
        <SwiperSlide>
          <DebitCard
            type="original"
            branch={cardBranch}
            cardName={cardName}
            account={cardAccount}
            balance={cardBalance}
            functionList={functionList}
            moreList={moreList}
            moreDefault={false}
            color="yellow"
          />
        </SwiperSlide>
      </>
    );
  };

  useCheckLocation();
  usePageInfo('/api/securitiesSwapAccounts');

  return (
    <SecuritiesSwapAccountsWrapper>
      <div className="userCardArea">
        <Swiper
          slidesPerView={1.14}
          spaceBetween={8}
          centeredSlides
          pagination
          onSlideChange={handleChangeSlide}
        >
          { cardInfo && renderDebitCard(cardInfo) }
        </Swiper>
      </div>
      <div className="transactionDetail" ref={ref}>
        { computedCardList && renderDetailCardList(computedCardList) }
        <Link className="moreButton" to="/securitiesSwapAccounts">
          更多明細
          <ArrowForwardIos />
        </Link>
      </div>
    </SecuritiesSwapAccountsWrapper>
  );
};

export default SecuritiesSwapAccounts;