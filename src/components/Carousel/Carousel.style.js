import styled, { keyframes } from 'styled-components';

const biggerEffect = keyframes`
	0% {
		transform: scale(0);
	}
	100% {
		transform: scale(1);
	}
`;

export const CarouselWrapper = styled.div`
	position: absolute;
	width: 342px;
	height: 342px;
	animation: ${biggerEffect} 0.2s;
`;

export const CarouselItem = styled.img`
	position: relative;
	float: left;
	flex-grow: 2;
	width: 342px;
	height: 342px;

	background: url(${props => props.src});
	background-size: cover;
	/* Black/50 */
	overflow: hidden;
	border: 1px solid #fafafa;
	border-radius: 16px;
`;

export const NavigatePrev = styled.img`
	position: absolute;
	left: -30px;
	top: 122px;
	z-index: 2;
	width: 100px;
	height: 100px;
	cursor: pointer;
`;

export const NavigateNext = styled.img`
	position: absolute;
	top: 122px;
	right: -30px;
	z-index: 2;
	width: 100px;
	height: 100px;
	cursor: pointer;
`;
