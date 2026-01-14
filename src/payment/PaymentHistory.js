import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import fetchData from "../config/fetchData";
import Icon from "react-native-vector-icons/MaterialIcons";

const SCREEN_WIDTH = Math.round(
  require("react-native").Dimensions.get("window").width
);
const SCREEN_HEIGHT = Math.round(
  require("react-native").Dimensions.get("window").height
);

const PaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPaymentHistory = async (pageNum = 1, isRefresh = false) => {
    if (pageNum === 1) {
      isRefresh ? setRefreshing(true) : setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await fetchData.getPaymentHistory(pageNum);
      console.log("--------response payment history--------", response);
      
      if (response.success) {
        const newData = response.data || [];
        
        if (pageNum === 1) {
          setPaymentHistory(newData);
        } else {
          setPaymentHistory((prev) => [...prev, ...newData]);
        }

        setHasMore(newData.length === 10); 
      } else {
        console.error("Failed to fetch payment history:", response.message);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      setHasMore(true);
      fetchPaymentHistory(1);
    }, [])
  );

  const onRefresh = () => {
    setPage(1);
    setHasMore(true);
    fetchPaymentHistory(1, true);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPaymentHistory(nextPage);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "success":
      case "completed":
        return "#4CAF50";
      case "pending":
        return "#FF9800";
      case "failed":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "success":
      case "completed":
        return "check-circle";
      case "pending":
        return "access-time";
      case "failed":
        return "cancel";
      default:
        return "help";
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>₹</Text>
          <Text style={styles.amount}>
            {parseFloat(item.paid_amount).toFixed(2)}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.pay_status) },
          ]}
        >
          <Icon
            name={getStatusIcon(item.pay_status)}
            size={14}
            color="#fff"
            style={styles.statusIcon}
          />
          <Text style={styles.statusText}>{item.pay_status}</Text>
        </View>
      </View>

      <View style={styles.itemDetails}>
        <View style={styles.detailRow}>
          <Icon name="calendar-today" size={16} color="#666" />
          <Text style={styles.detailText}>
            {new Date(item.payment_date).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="access-time" size={16} color="#666" />
          <Text style={styles.detailText}>
            {new Date(item.payment_date).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>

      {/* Payment Mode and Type */}
      {/* <View style={styles.additionalInfo}>
        <View style={styles.infoRow}>
          <Icon name="payment" size={14} color="#666" />
          <Text style={styles.infoLabel}>Mode: </Text>
          <Text style={styles.infoValue}>{item.payment_mode}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="account-balance-wallet" size={14} color="#666" />
          <Text style={styles.infoLabel}>Type: </Text>
          <Text style={styles.infoValue}>{item.order_pay_type}</Text>
        </View>
      </View> */}

      {item.remaining_paying_balance && parseFloat(item.remaining_paying_balance) > 0 && (
        <View style={styles.balanceContainer}>
          <Icon name="account-balance" size={14} color="#FF9800" />
          <Text style={styles.balanceLabel}>Remaining Balance: </Text>
          <Text style={styles.balanceAmount}>
            ₹{parseFloat(item.remaining_paying_balance).toFixed(2)}
          </Text>
        </View>
      )}

      {/* Transaction ID */}
      <View style={styles.transactionIdContainer}>
        <Icon name="receipt" size={14} color="#999" />
        <Text style={styles.transactionId}>ID: #{item.id}</Text>
      </View>

      {/* Due Date */}
      {item.due_date && (
        <View style={styles.dueDateContainer}>
          <Icon name="event" size={14} color="#999" />
          <Text style={styles.dueDate}>
            Due: {new Date(item.due_date).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
      )}
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Icon name="receipt-long" size={80} color="#E0E0E0" />
        <Text style={styles.emptyTitle}>No Payment History</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading payment history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={paymentHistory}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          paymentHistory.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#D45500"]}
            tintColor="#D45500"
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  listContent: {
    padding: SCREEN_WIDTH * 0.04,
    paddingBottom: SCREEN_HEIGHT * 0.1,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: SCREEN_WIDTH * 0.04,
    marginBottom: SCREEN_HEIGHT * 0.015,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginRight: 2,
  },
  amount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  additionalInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
  },
  infoValue: {
    fontSize: 13,
    color: "#333",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  balanceLabel: {
    fontSize: 13,
    color: "#E65100",
    marginLeft: 6,
  },
  balanceAmount: {
    fontSize: 14,
    color: "#E65100",
    fontWeight: "700",
  },
  transactionIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  transactionId: {
    fontSize: 12,
    color: "#999",
    marginLeft: 6,
    fontFamily: "monospace",
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  dueDate: {
    fontSize: 12,
    color: "#999",
    marginLeft: 6,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SCREEN_HEIGHT * 0.1,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default PaymentHistory;