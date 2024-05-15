import React, { useState, useEffect } from 'react';
import Panel from '../../../components/Panel/Panel';
import SideBar from '../../../components/SideBar/SideBar';
import Wrapper, { WrapperInner } from '../../../components/Wrapper/Wrapper';
import PictureCircle from '../../../components/PictureCircle/PictureCircle';
import * as S from './HomeMainPage.style';
import MainHeader from '../../../components/Home/MainHeader/MainHeader';
import Modal from '../../../components/Modal/Modal';
import { useNavigate } from 'react-router-dom';
import SmallButton from '../../../components/Button/SmallButton/SmallButton';
import RefreshCircle from '../../../components/Home/RefreshCircle/RefreshCircle';
import HomeFeedPage from '../Feed/HomeFeedPage';
import { useQuery } from 'react-query';
import api from '../../../api/api';

const HomeMainPage = () => {
	const navigate = useNavigate();
	const [isModal, setIsModal] = useState(false);
	const [selectedFeed, setSelectedFeed] = useState(0);
	const [feedViewState, setFeedViewState] = useState(false);
	const { data: userInfo } = useQuery('getProfile', () => api('/api/user'));
	const { data: partnerInfo } = useQuery('getPartnerInfo', () => api('/api/partner'));

	useEffect(() => {
		localStorage.setItem('nickname', userInfo?.data.nickname);
	}, [userInfo]);

	// useEffect(() => {
	// 	if (feedViewState) {
	// 		setFeedViewState(false);
	// 		return () => {
	// 			setFeedViewState(false);
	// 		};
	// 	}
	// }, [feedViewState]);

	useEffect(() => {
		localStorage.setItem('nickname', userInfo?.data.nickname);
	}, [userInfo?.data]);

	const handleFeedButton = e => {
		setSelectedFeed(+e.currentTarget.id);
		setFeedViewState(true);
	};

	if (feedViewState)
		return (
			<HomeFeedPage setViewState={setFeedViewState} userInfo={partnerInfo?.data[selectedFeed]} />
		);
	else
		return (
			<Wrapper>
				<WrapperInner>
					{isModal && (
						<Modal
							width={27.8}
							height={23.5}
							isModal={isModal}
							onCloseModal={() => {
								setIsModal(false);
							}}
						>
							<S.ModalInner>
								<S.InfoBig>티켓을 사용해서</S.InfoBig>
								<S.InfoBig>새로운 매칭 상대를</S.InfoBig>
								<S.InfoBig>추천 받아보시겠어요?</S.InfoBig>
								<S.InfoSmall>잔여 티켓:30장</S.InfoSmall>
								<SmallButton
									onClick={() => {
										navigate('picture');
									}}
								>
									새로 추천받기
								</SmallButton>
								<SmallButton
									size="small"
									onClick={() => {
										setIsModal(false);
									}}
									color="white"
								>
									취소
								</SmallButton>
							</S.ModalInner>
						</Modal>
					)}

					<MainHeader />
					<Panel size="small">
						<S.PanelInfoInner>
							<PictureCircle size="midium" src={userInfo?.data?.profile} />
							<S.InfoBig>사진을 추가해보세요</S.InfoBig>
							<S.InfoMidium>
								{userInfo?.data?.nickname}님의 내적매력을 피드에 담아보세요
							</S.InfoMidium>
							<SmallButton
								size="small"
								onClick={() => {
									setIsModal(true);
								}}
							>
								사진 추가하기
							</SmallButton>
						</S.PanelInfoInner>
					</Panel>
					{partnerInfo?.data.length > 0 &&
						partnerInfo?.data?.map((feedItem, idx) => (
							<Panel size="large" key={idx}>
								<S.PanelFeedInner onClick={handleFeedButton} id={idx}>
									<S.FeedProfile>
										<PictureCircle src={feedItem.profile} size="small" />
										<S.FeedProfileInfo>{feedItem.nickname}</S.FeedProfileInfo>
									</S.FeedProfile>
									<S.FeedInfo>
										<S.InfoMidium>{feedItem.bio}</S.InfoMidium>
									</S.FeedInfo>
									<S.FeedImageList>
										{feedItem?.feed?.map((feed, idx) => (
											<S.FeedImageItem key={idx} src={feed} />
										))}
									</S.FeedImageList>
								</S.PanelFeedInner>
							</Panel>
						))}
				</WrapperInner>
				<SideBar status="home" />
				<RefreshCircle
					onClick={() => {
						window.location.replace('/home');
					}}
				/>
			</Wrapper>
		);
};

export default HomeMainPage;
