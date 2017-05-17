// https://github.com/voronianski/soundcloud-audio.js
import React from "react";
import Hammer from "react-hammerjs";
import { Link } from "react-router-dom";
import SoundCloudAudio from "soundcloud-audio";
import * as FontAwesome from "react-icons/lib/fa/";
import FireLike from "../likes/fire_like";

class BurnCartelPlayer extends React.Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.goToNextTrack = this.goToNextTrack.bind(this);
		this.goToPrevTrack = this.goToPrevTrack.bind(this);
		this.playAndLoadTrack = this.playAndLoadTrack.bind(this);
		this.pauseTrack = this.pauseTrack.bind(this);
		this.playTrack = this.playTrack.bind(this);
		this.scAudio = new SoundCloudAudio(props.clientId);
		window.sc = this.scAudio;
		this.secondsToMinutes = this.secondsToMinutes.bind(this);
		this.track = null;
		this.playIcon = null;

		this.tapTimers = [];
		this.isDoubleTap = false;

		this.state = {
			color: "black"
		};
	}

	secondsToMinutes(seconds) {
		let timeStamp;
		const secondsLeft = seconds % 60;
		const minutesLeft = Math.floor(seconds / 60);

		if (secondsLeft < 10) {
			timeStamp = `${minutesLeft}:0${secondsLeft}`;
		} else {
			timeStamp = `${minutesLeft}:${secondsLeft}`;
		}

		return timeStamp;
	}

	playAndLoadTrack() {
		this.playTrack();

		let currentTime = 0;

		this.scAudio.on("timeupdate", () => {
			if (!this.props.trackLoaded && this.scAudio.audio.currentTime > 0) {
				this.props.setTrackLoaded();
			}

			if (this.scAudio.audio.currentTime - currentTime > 1) {
				currentTime++;
				this.props.updateCurrentTime(currentTime);
			}
			// what constitutes a play?
			// how many seconds in?
		});

		this.scAudio.on("ended", () => {
			if (this.props.nextTrackId) {
				this.props.updateTrackId(this.props.nextTrackId);
			} else {
				console.log("out of tracks.. must paginate!");
			}
			// maybe here we send a post request to increment play count of
			// this track and add to user's history
		});
	}

	goToNextTrack() {
		if (this.props.nextTrackId) {
			this.props.updateTrackId(this.props.nextTrackId);
		} else {
			console.log("out of tracks.. must paginate!");
		}
	}

	goToPrevTrack() {
		if (this.props.prevTrackId) {
			this.props.updateTrackId(this.props.prevTrackId);
		} else {
			console.log("no prev track found in player");
		}
	}

	pauseTrack() {
		this.scAudio.pause();
	}

	playTrack() {
		this.scAudio.play({ streamUrl: this.track.stream_url });
	}

	componentWillReceiveProps(nextProps) {
		// TRACK CHANGED
		if (this.props.trackId !== nextProps.trackId) {
			this.track = nextProps.track;
			this.props.setTrackNotLoaded();
			this.playAndLoadTrack();
		} else if (this.props.playing !== nextProps.playing) {
			if (!nextProps.playing) {
				this.pauseTrack();
			} else {
				this.playTrack();
			}
		}
	}

	toggle() {
		this.props.togglePlay();
	}

	render() {
		if (!this.props.playing) {
			this.playIcon = (
				<FontAwesome.FaPlayCircleO
					size={40}
					color="aliceblue"
					className="bc-icon"
				/>
			);
		} else {
			this.playIcon = (
				<FontAwesome.FaPauseCircleO
					size={40}
					color="aliceblue"
					className="bc-icon"
				/>
			);
		}

		let details = <div />;

		if (this.track && this.props.trackLoaded) {
			let trackName = this.track.name;
			if (this.track.name.length > 17) {
				trackName = `${this.track.name.slice(0, 17)}...`;
			}

			details = (
				<div className="track-details-text">
					<div className="track-top-details">

						{/* <Link
                to={`/tracks/${this.track.id}`}
              > */}
						<span className="track-name">

							{trackName}
						</span>
						{/* </Link> */}
						•
						{/* <Link
                to={`/publishers/${this.props.publisherId}`}
              > */}
						<span className="track-artist">
							{` ${this.track.publisher.name.slice(0, 15)} `}
						</span>
						{/* </Link> */}

					</div>
					{/* <div>
              Playing from {this.props.feedName.toUpperCase()} feed
            </div> */}
					{/* <div>
              {this.secondsToMinutes(this.props.currentTime)}
            </div> */}
				</div>
			);
		} else if (this.track && !this.props.trackLoaded) {
			details = (
				<div>
					LOADING
				</div>
			);
		}

		if (this.props.playerInitialized) {
			const {
				isLoggedIn,
				loginFB,
				likePostInProgress,
				likeUnlikeTrack,
				numLikes,
				trackId,
				track,
				userLikes
			} = this.props;

			const isLikedByUser = userLikes[trackId] === undefined ? false : true;

			let playerColor = "";
			if (isLikedByUser) {
				playerColor = "#ff9000";
			}

			const tapInterval = 450;
			const tapIntervalDelta = 50;

			return (
				<div
					className="burn-cartel-player-container"
					style={{ background: playerColor }}
				>

					<div className="burn-cartel-player">

						<Hammer
							options={{
								recognizers: {
									swipe: {
										threshold: 1
									},
									tap: {
										taps: 1,
										interval: tapInterval
									}
								}
							}}
							onTap={e => {
								e.preventDefault();
								const idx = this.tapTimers.length;

								this.tapTimers.push(
									setTimeout(() => {
										if (!this.isDoubleTap) {
											window.location = `#/tracks/${this.track.id}`;
										} else {
											if (idx !== 0) clearTimeout(this.tapTimers[idx + 1]);
											this.isDoubleTap = false;
										}
									}, tapInterval + tapIntervalDelta)
								);
							}}
							onDoubleTap={e => {
								e.preventDefault();
								this.isDoubleTap = true;
								if (!isLoggedIn) {
									// loginFB();
								} else if (likePostInProgress) {
									// assuming track has not already been liked
									// console.log('wait for other like create/detroy action to finish!');
								} else {
									likeUnlikeTrack(trackId);
								}
							}}
							onSwipe={e => {
								if (e.direction === 2) {
									this.goToNextTrack();
								} else if (e.direction == 4) {
									this.goToPrevTrack();
								}
							}}
						>

							<div className="burn-cartel-player-details">
								<div className="dummy-icon">
									{this.playIcon}
								</div>
								{details}
							</div>

						</Hammer>

						<div className="burn-cartel-player-control">

							{/* <FireLike
                isLoggedIn={isLoggedIn}
                loginFB={loginFB}
                likePostInProgress={likePostInProgress}
                likeUnlikeTrack={likeUnlikeTrack}
                isLikedByUser={userLikes[trackId] === undefined ? false : true }
                trackId={trackId}
                size={30}
              /> */}

							{/* <FontAwesome.FaStepBackward
                size={40}
                color='aliceblue'
                className='bc-icon'/> */}

							<div onClick={this.toggle}>
								{this.playIcon}
							</div>

							{/* <FontAwesome.FaStepForward
                  size={40}
                  color='aliceblue'
                  className='bc-icon'
                  onClick={this.goToNextTrack}
                /> */}

							{/* <div onClick={this.props.toggleRepeat}>
                    <FontAwesome.FaRepeat
                    size={40}
                    color={this.props.repeating? 'green' : 'red'}
                    className='bc-icon'/>
                  </div> */}

						</div>
					</div>

				</div>
			);
		} else {
			return <div />;
		}
	}
}

export default BurnCartelPlayer;
