import React, { memo } from "react";

import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbDownOutline from "@material-ui/icons/ThumbDownOutlined";
import AddCommentIcon from "@material-ui/icons/AddComment";
import { withStyles } from "@material-ui/core/styles";

import { num2str } from "../utils/helpers";

const styles = (theme) => ({
  container: { padding: 0 },
  metric: {
    fontSize: 14,
    marginRight: 12,
    minWidth: 30,
  },
  icon: {},
});

const ContentActions = ({
  classes,
  contentType,
  liked,
  disliked,
  likeCount,
  dislikeCount,
  commentCount,
  like,
  dislike,
}) => {
  const likeIcon = liked ? <FavoriteIcon /> : <FavoriteBorderIcon />;
  const dislikeIcon = disliked ? <ThumbDownIcon /> : <ThumbDownOutline />;
  return (
    <CardActions className={classes.container} disableSpacing>
      <IconButton className={classes.icon} onClick={like}>
        {likeIcon}
      </IconButton>
      <span className={classes.metric}>{num2str(likeCount)}</span>
      <IconButton className={classes.icon} onClick={dislike}>
        {dislikeIcon}
      </IconButton>
      <span className={classes.metric}>{num2str(dislikeCount)}</span>
      <IconButton className={classes.icon} style={{ pointerEvents: "none" }}>
        <AddCommentIcon />
      </IconButton>
      <span className={classes.metric}>{num2str(commentCount)}</span>
    </CardActions>
  );
};

export default withStyles(styles)(memo(ContentActions));
