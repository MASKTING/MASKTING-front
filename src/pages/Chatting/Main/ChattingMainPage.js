import * as S from './ChattingMainPage.style';
import React from 'react';
import { useState } from 'react';
import Wrapper, { WrapperInner } from '../../../components/Wrapper/Wrapper';
import PictureCircle from '../../../components/PictureCircle/PictureCircle';
import SideBar from '../../../components/SideBar/SideBar';
import { getChattingRooms } from '../../../api/chatting';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const CHATTINGROOMLIST = [
	{ id: 1, sender: '분당청소요정', message: '안녕하세요?' },
	{ id: 2, sender: '분당청소요정', message: '안녕하세요?' },
	{ id: 3, sender: '분당청소요정', message: '안녕하세요?' },
	{ id: 4, sender: '분당청소요정', message: '안녕하세요?' },
	{ id: 5, sender: '분당청소요정', message: '안녕하세요?' },
	{ id: 6, sender: '분당청소요정', message: '안녕하세요?' },
	{ id: 7, sender: '분당청소요정', message: '안녕하세요?' },
	{ id: 8, sender: '분당청소요정', message: '안녕하세요?' },
	{ id: 9, sender: '분당청소요정', message: '안녕하세요?' },
];

const ChattingMainPage = () => {
	const [chattingRoomList, setChattingRoomList] = useState([]);

	const getchattingRoomsMethod = async () => {
		const data = await getChattingRooms();
		console.log(data);
		setChattingRoomList(data);
	};

	useEffect(() => {
		getchattingRoomsMethod();
	}, []);

	const navigate = useNavigate();
	const handleNavigateRequest = () => {
		navigate('request');
	};
	const handleNavigateRoom = e => {
		navigate(`/chatting/room/${e.currentTarget.dataset.roomid}`);
	};
	return (
		<Wrapper titleMessage="채팅">
			<WrapperInner>
				<S.NotifyBox onClick={handleNavigateRequest}>
					<S.NotifyPictureBox>
						<PictureCircle size="small"></PictureCircle>
					</S.NotifyPictureBox>
					<S.NotifyTextBox>
						<S.NotifyTitle>새로운 대화요청이 도착했습니다</S.NotifyTitle>
						<S.NotifyInfo>여기를 눌러 프로필을 확인해보세요</S.NotifyInfo>
					</S.NotifyTextBox>
				</S.NotifyBox>
				{!!chattingRoomList.length ? (
					<S.ChattingRoomList>
						{chattingRoomList?.map(chattingRoom => (
							<S.ChattingRoomItem
								onClick={handleNavigateRoom}
								data-roomid={chattingRoom?.roomId}
								key={chattingRoom.roomId}
							>
								<S.ChattingProfileBox>
									<PictureCircle src={chattingRoom.profile} size="small"></PictureCircle>
								</S.ChattingProfileBox>
								<S.ChattingMainBox>
									<S.ChattingSender>{chattingRoom.roomName}</S.ChattingSender>
									<S.ChattingMessage>{chattingRoom.lastMessage}</S.ChattingMessage>
								</S.ChattingMainBox>
							</S.ChattingRoomItem>
						))}
					</S.ChattingRoomList>
				) : (
					<S.NoChattingRoom>
						<S.NoChattingEmo className="material-icons">chat_bubble</S.NoChattingEmo>
						<S.NoChattingMessage>요청받은 메세지가 없어요</S.NoChattingMessage>
					</S.NoChattingRoom>
				)}
			</WrapperInner>
			<SideBar status="chatting" />
		</Wrapper>
	);
};

export default ChattingMainPage;
