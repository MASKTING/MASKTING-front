import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './WaitMaskEdit.style';
import Wrapper from '../../../components/Wrapper/Wrapper';
import { Rnd } from 'react-rnd';
import html2canvas from 'html2canvas';
import { NavigateButton } from '../../../components/Button/Button';
import BigButton from '../../../components/Button/BigButton/BigButton';
import { useRecoilState } from 'recoil';
import { imageState, imageUrlState } from '../../../recoil';

const WaitMaskEdit = () => {
	const navigate = useNavigate();
	const [mask, setMask] = useState('');
	const [profilePreview, setProfilePreview] = useState(localStorage?.getItem('imageData'));
	const maskList = [
		{ id: 1, name: 'mask1.png' },
		{ id: 2, name: 'mask2.png' },
		{ id: 3, name: 'mask3.png' },
	];

	const [imageFile, setImageFile] = useRecoilState(imageState);
	const [imageUrl, setImageUrl] = useRecoilState(imageUrlState);
	const captureImg = async () => {
		window.scrollTo(0, 0);
		let url = '';
		await html2canvas(document.getElementById('captureDiv')).then(async canvas => {
			setImageFile({
				...imageFile,
				maskedImage: dataURLtoFile(canvas.toDataURL('image/png'), 'maskedImage.jpg'),
			});
			setImageUrl(canvas.toDataURL('image/png'));
		});
	};

	const dataURLtoFile = (dataurl, fileName) => {
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}

		return new File([u8arr], fileName, { type: mime });
	};

	const handleEdit = async () => {
		await captureImg();
		navigate('/wait/fail/edit');
	};

	return (
		<Wrapper>
			<S.TitleWrapper>
				<S.Title>가면을 씌워주세요</S.Title>
				<S.InfoText>
					가면은 <S.Red>자신이 원할 때에만</S.Red> 벗을 수 있으며, 그 전까지는
				</S.InfoText>
				<S.InfoText>가면을 쓴 상태로 유지됩니다.</S.InfoText>
			</S.TitleWrapper>
			<S.Content>
				<S.ImageWrapper>
					<S.captureDiv id="captureDiv">
						<S.Image src={profilePreview} />
						{mask !== '' ? (
							<Rnd
								default={{
									x: 75,
									y: 75,
									width: 250,
									height: 70,
								}}
								minWidth={20}
								minHeight={10}
								bounds="window"
							>
								<S.MaskItem
									alt="마스크 이미지"
									src={require(`../../../assets/${mask}`)}
									style={{ width: '100%', height: '100%' }}
								/>
							</Rnd>
						) : (
							''
						)}
					</S.captureDiv>
				</S.ImageWrapper>
				<S.InfoMessage>
					<S.Red>얼굴에 맞게 가면의 위치와 크기를 조절해보세요</S.Red>
				</S.InfoMessage>
				<S.MaskListWrapper>
					<S.MaskList>
						{maskList.map(Item => {
							return (
								<S.MaskItemWrapper key={Item.id}>
									<S.MaskItem
										value={Item.name}
										src={require(`../../../assets/${Item.name}`)}
										onClick={() => setMask(Item.name)}
									/>
								</S.MaskItemWrapper>
							);
						})}
					</S.MaskList>
				</S.MaskListWrapper>
			</S.Content>
			<BigButton onClick={handleEdit}>수정했어요</BigButton>
		</Wrapper>
	);
};

export default WaitMaskEdit;
