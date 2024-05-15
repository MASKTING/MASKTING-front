import React from 'react';
import { useNavigate } from 'react-router-dom';
import Wrapper from '../../../components/Wrapper';
import { WrapperInner } from '../../../components/Wrapper/Wrapper.style';
import BigButton from '../../../components/Button/BigButton/BigButton';
import SideBar from '../../../components/SideBar/SideBar';
import * as S from './WaitFail.style';
import RejectReason from './RejectReason/RejectReason';
import { useQuery } from 'react-query';
import api from '../../../api/api';

const WaitFail = () => {
	const navigate = useNavigate();
	const { data: resignUpInfo } = useQuery('getResignupInfo', () => api('/api/user/re-signup'));
	const { data: rejection } = useQuery('getRejection', () => api('/api/user/rejection'));
	return (
		<Wrapper>
			<WrapperInner>
				<S.Title>
					{resignUpInfo?.data.nickname}님
					<br />
					다시 한번 확인해주세요
				</S.Title>
				<S.Content>
					<S.InfoTitle>
						<RejectReason reason={rejection?.data?.reason} />
						<div>다음과 같은 사유로 가입 승인이 반려되었어요 </div>
					</S.InfoTitle>
				</S.Content>
				<BigButton
					onClick={() => {
						navigate('/wait/fail/edit');
					}}
				>
					수정하러 가기
				</BigButton>
			</WrapperInner>
		</Wrapper>
	);
};

export default WaitFail;
