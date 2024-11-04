import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
 

const FriendSearchForm = ({ user, isFriend = false }) => {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, backgroundColor: 'black', color: 'white' }}>
      
      <Avatar 
        alt={`${user.first_name} ${user.last_name}`} 
        sx={{ width: 40, height: 40, mr: 2, bgcolor: 'grey.800' }}
      >
        {user.first_name ? user.first_name[0] : user.handle[0]}
      </Avatar>
      
      <CardContent sx={{ padding: 0 }}>
        
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
          {user.first_name ? `${user.first_name} ${user.last_name}` : user.handle}
          {isFriend && (
            <GroupIcon sx={{ ml: 1, color: 'grey.400', fontSize: '1.5rem' }} />
          )}
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'grey.500' }}>
          @{user.handle}
        </Typography>
      
      </CardContent>
    
    </Card>
  );
};

export default FriendSearchForm;
