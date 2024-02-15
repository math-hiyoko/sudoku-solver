#include <cassert>

#include "DancingLinks.hpp"


DancingLinks::DancingNode::DancingNode() : left(this), right(this), up(this), down(this), column(nullptr) {}

DancingLinks::DancingNode* DancingLinks::DancingNode::hookDown(DancingNode* node) {
    assert(node != nullptr);
    assert(this != nullptr);
    node->down = this->down;
    node->down->up = node;
    node->up = this;
    this->down = node;
    return node;
}

DancingLinks::DancingNode* DancingLinks::DancingNode::hookRight(DancingNode* node) {
    assert(node != nullptr);
    assert(this != nullptr);
    node->right = this->right;
    node->right->left = node;
    node->left = this;
    this->right = node;
    return node;
}

void DancingLinks::DancingNode::unlinkLR() {
    this->left->right = this->right;
    this->right->left = this->left;
}

void DancingLinks::DancingNode::relinkLR() {
    this->left->right = this;
    this->right->left = this;
}

void DancingLinks::DancingNode::unlinkUD() {
    this->up->down = this->down;
    this->down->up = this->up;
}

void DancingLinks::DancingNode::relinkUD() {
    this->up->down = this;
    this->down->up = this;
}

DancingLinks::ColumnNode::ColumnNode(int id) : DancingLinks::DancingNode(), size(0), id(id) {
    this->column = this;
}

void DancingLinks::ColumnNode::cover() {
    this->unlinkLR();
    for (DancingNode* i = this->down; i != this; i = i->down) {
        for (DancingNode* j = i->right; j != i; j = j->right) {
            j->unlinkUD();
            j->column->size--;
        }
    }
    DancingLinks::header->size--;
}

void DancingLinks::ColumnNode::uncover() {
    for (DancingNode* i = this->up; i != this; i = i->up) {
        for (DancingNode* j = i->left; j != i; j = j->left) {
            j->column->size++;
            j->relinkUD();
        }
    }
    this->relinkLR();
    DancingLinks::header->size++;
}