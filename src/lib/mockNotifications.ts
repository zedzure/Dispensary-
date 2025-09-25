
import { realImageUrls } from "./products";

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'follow' | 'unfollow' | 'reply' | 'milestone' | 'receipt' | 'admin';
  text: string;
  userName?: string;
  userAvatar?: string;
  date: Date;
  read: boolean;
}

const users = [
  { name: "SativaSteve", avatar: realImageUrls[0] },
  { name: "IndicaIvy", avatar: realImageUrls[1] },
  { name: "TerpeneTerry", avatar: realImageUrls[2] },
];

export const generateMockNotifications = (userId: string): Notification[] => {
  const notifications: Notification[] = [];
  const notificationTypes: Notification['type'][] = ['like', 'follow', 'reply', 'milestone', 'receipt', 'admin'];

  for (let i = 0; i < 25; i++) {
    const type = notificationTypes[i % notificationTypes.length];
    const user = users[i % users.length];
    let text = "";

    switch(type) {
      case 'like':
        text = `<strong>${user.name}</strong> liked your review of <em>Blue Dream</em>.`;
        break;
      case 'follow':
        text = `<strong>${user.name}</strong> started following you.`;
        break;
      case 'unfollow':
        text = `<strong>${user.name}</strong> unfollowed you.`;
        break;
      case 'reply':
        text = `<strong>${user.name}</strong> replied to your comment: "I agree, that was a great batch!"`;
        break;
      case 'milestone':
        text = `Congratulations! You've reached the <strong>Gold Tier</strong> in our loyalty program.`;
        break;
      case 'receipt':
        text = `Your receipt for <strong>$54.20</strong> has been approved. <strong>54 points</strong> have been added to your account.`;
        break;
      case 'admin':
        text = `Important update: Our holiday hours are now in effect. We'll be closing at 8 PM on Christmas Eve.`;
        break;
    }
    
    notifications.push({
      id: `note-${i}`,
      userId: userId,
      type: type,
      text: text,
      userName: user.name,
      userAvatar: user.avatar,
      date: new Date(Date.now() - i * 3600000 * 3), // 3 hours apart
      read: i > 4 // Mark first 5 as unread
    });
  }
  
  return notifications.sort((a,b) => b.date.getTime() - a.date.getTime());
};
